<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/26
 * Time: 21:49
 */

namespace app\api\model;


class User extends BaseModel
{

    /**
     * 用户是否存在
     * 存在返回uid，不存在返回0
     */
    public function content()
    {
        return $this->hasMany('Content','uid','id');
    }
    public function collect()
    {
        return $this->belongsToMany('Content','collect','cid','uid');
    }
    public function getUidAttr($value)
    {

    }


    public static function getByOpenID($openid)
    {
        $user = self::where('openid', '=', $openid)
            ->find();
        return $user;
    }



}