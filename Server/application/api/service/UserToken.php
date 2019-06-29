<?php

namespace app\api\service;

use app\api\model\User;
use app\lib\enum\ScopeEnum;
use app\lib\exception\TokenException;
use app\lib\exception\WeChatException;
use think\Exception;
use think\Model;

/**
 * 微信登录
 * 如果担心频繁被恶意调用，请限制ip
 * 以及访问频率
 */
class UserToken extends Token//更多的内容是通过code来访问微信服务器获取open id以及用户的信息
//然后生成令牌并保存到tp5提供的缓存
{
    protected $code;
    protected $wxLoginUrl;
    protected $wxAppID;
    protected $wxAppSecret;
//在实例化UserToken类的时候把整个url通过构造函数拼接好
//方便在get方法中直接使用发出请求
    function __construct($code)
    {
        $this->code = $code;
        $this->wxAppID = config('wx.app_id');
        $this->wxAppSecret = config('wx.app_secret');
        $this->wxLoginUrl = sprintf(
            config('wx.login_url'), $this->wxAppID, $this->wxAppSecret, $this->code);
    }

    
    /**
     * 登陆
     * 思路1：每次调用登录接口都去微信刷新一次session_key，生成新的Token，不删除久的Token
     * 思路2：检查Token有没有过期，没有过期则直接返回当前Token
     * 思路3：重新去微信刷新session_key并删除当前Token，返回新的Token
     */
    public function get()
    {
        $result = curl_get($this->wxLoginUrl);//在构造函数中已经根据小程序传进来的code来生成再次
        //访问微信服务器获取openid的url

        // 注意json_decode的第一个参数true
        // 这将使字符串被转化为数组而非对象

        $wxResult = json_decode($result, true);
        if (empty($wxResult)) {
            // 为什么以empty判断是否错误，这是根据微信返回
            // 规则摸索出来的
            // 这种情况通常是由于传入不合法的code
            throw new Exception('获取session_key及openID时异常，微信内部错误');
        }
        else {
            // 建议用明确的变量来表示是否成功
            // 微信服务器并不会将错误标记为400，无论成功还是失败都标记成200
            // 这样非常不好判断，只能使用errcode是否存在来判断
            $loginFail = array_key_exists('errcode', $wxResult);
            if ($loginFail) {
                $this->processLoginError($wxResult);
            }
            else {
                return $this->grantToken($wxResult);
            }
        }
    }

    // 判断是否重复获取
    private function duplicateFetch(){
       //TODO:目前无法简单的判断是否重复获取，还是需要去微信服务器去openid
        //TODO: 这有可能导致失效行为 
    }

    // 处理微信登陆异常
    // 那些异常应该返回客户端，那些异常不应该返回客户端
    // 需要认真思考
    private function processLoginError($wxResult)
    {
        throw new WeChatException(
            [
                'msg' => $wxResult['errmsg'],
                'errorCode' => $wxResult['errcode']
            ]);
    }

    // 写入缓存
    private function saveToCache($wxResult)
    {
        $key = self::generateToken();
        $value = json_encode($wxResult);
        $expire_in = config('setting.token_expire_in');//这个是配置的缓存有效期
        $result = cache($key, $value, $expire_in);//调用的是tp5提供的缓存机制，后面的是缓存有效期，
        //同时也可以顺便当作token的有效期

        if (!$result){//返回客户端的异常才要新建exception类，返回服务器的话调用tp5自带
            //的exception就好
            throw new TokenException([
                'msg' => '服务器缓存异常',
                'errorCode' => 10005
            ]);
        }
        return $key;//返回的key还是token
    }

    // 颁发令牌
    // 只要调用登陆就颁发新令牌
    // 但旧的令牌依然可以使用
    // 所以通常令牌的有效时间比较短
    // 目前微信的express_in时间是7200秒
    // 在不设置刷新令牌（refresh_token）的情况下
    // 只能延迟自有token的过期时间超过7200秒（目前还无法确定，在express_in时间到期后
    // 还能否进行微信支付
    // 没有刷新令牌会有一个问题，就是用户的操作有可能会被突然中断
    private function grantToken($wxResult)
    {
        // 此处生成令牌使用的是TP5自带的令牌
        // 如果想要更加安全可以考虑自己生成更复杂的令牌
        // 比如使用JWT并加入盐，如果不加入盐有一定的几率伪造令牌
        //        $token = Request::instance()->token('token', 'md5');
        $openid = $wxResult['openid'];
        $user = User::getByOpenID($openid);
        if (!$user)
            // 借助微信的openid作为用户标识
            // 但在系统中的相关查询还是使用自己的uid
        {
            $uid = $this->newUser($openid);//newUser的作用一个是在user表中插入以openid来新建一个用户
            //其次返回新建的user由数据库自动生成的id,供之后的查询使用
        }
        else {
            $uid = $user->id;//就算是有这个用户也要把id返回供查询使用（先写入缓存）
        }
        $cachedValue = $this->prepareCachedValue($wxResult, $uid);//openid太重要了，只能保存在数据库，
        //用的多的只有id
        $token = $this->saveToCache($cachedValue);//写入缓存成功后返回的是token
        return $token;
    }


    private function prepareCachedValue($wxResult, $uid)
    {
        $cachedValue = $wxResult;
        $cachedValue['uid'] = $uid;
        $cachedValue['scope'] = ScopeEnum::User;
        return $cachedValue;
    }

    // 创建新用户
    private function newUser($openid)
    {
        // 有可能会有异常，如果没有特别处理
        // 这里不需要try——catch
        // 全局异常处理会记录日志
        // 并且这样的异常属于服务器异常
        // 也不应该定义BaseException返回到客户端
        $user = User::create(//因为在user表里面主要就只有一个openid字段
            [
                'openid' => $openid
            ]);
        return $user->id;
    }
}
