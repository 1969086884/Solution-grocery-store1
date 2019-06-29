<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/24
 * Time: 18:16
 */

namespace app\api\controller\v1;



use app\api\controller\BaseController;
use app\api\model\Benefit;


use app\api\validate\Count;
use app\api\validate\IDMustBePositiveInt;

use \app\api\model\Content as ContentModel;
use \app\api\model\Precaution as PrecautionModel;
use \app\api\model\Repair as RepairModel;
use \app\api\model\Benefit as BenefitModel;
use app\api\model\Pay as PayModel;
use app\api\model\Collect as CollectModel;

use app\api\validate\ContentV;
use app\api\validate\SearchRule;
use app\lib\Exception\MissException;

use app\api\validate\ContentRule;
use \app\api\service\Token as TokenService;
use \app\api\model\User as UserModel;
use app\lib\exception\SuccessMessage;
use app\lib\Exception\UploadException;
use think\Console;

class Content extends BaseController
{
//输入：任意一个ID  输出：文章详情内容（不包括设置为私密的心理建设和建议）
    public function getContentById($id)
    {
        (new IDMustBePositiveInt())->goCheck();
        $content=ContentModel::getContentOne($id);
        if(!$content)
        {
            throw new MissException(
                [ 'msg' => '还没有任何内容',
                    'errorCode' => 50000
                ]
            );

        }
        return $content;

    }

    /**+
     * @param $id  文章号
     * @return false|\PDOStatement|string|\think\Collection  正常返回该发起请求的用户文章所有内容（包括私密内容）
     * @throws MissException
     * @throws \app\lib\exception\ParameterException
     */
    public function getMyContentById($id)
    {
        (new IDMustBePositiveInt())->goCheck();
        $myContent=ContentModel::getMyContentOne($id);
        if(!$myContent)
        {

            throw new MissException(
                [ 'msg' => '还没有任何内容',
                    'errorCode' => 50000
                ]
            );
        }
        return $myContent;
    }

    /**+
     * @param $start 起始条目
     * @param int $count 数量
     * @return mixed
     * @throws MissException
     * @throws \app\lib\exception\ParameterException
     */
    public function getRecentFear($start,$count = 20)
    {
        (new Count())->goCheck();
        $fear=ContentModel::getMostRecent($start,$count);


        if(!$fear)
        {
            throw new MissException(
                ['msg' => '还没有任何恐惧内容',
                    'errorCode' => 50000
                ]);

        }




       return $fear->hidden(['collects.pivot','collects.create_time','collects.update_time','collects.extend']);

    }



     public function test()
     {
         $data=[
             'fear'=>'121士大夫但是sdff',
             'uid'=>'2',
             'privacy'=>'1',

         ];
       // $result=self::addUserContent($data);
         ContentModel::AddContent($data);
        //var_dump($result);

     }

    /**+
     * @param $start
     * @param int $count
     * @return mixed
     */

     public function getMyRecentFear($start,$count = 20)
     {
         (new Count())->goCheck();
         $uid=TokenService::getCurrentUid();

         $myfear=ContentModel::getMyContent($uid,$start,$count);
         if(!$myfear)
         {
             throw new MissException(
                 ['msg' => '还没有任何内容',
                     'errorCode' => 50000
                 ]);

         }
         return $myfear->hidden(['collects.pivot','collects.create_time','collects.update_time','collects.extend']);

     }

    /**+
     * 返回我的收藏内容
     */
     public function getMyCollect($start,$count=20)
     {
         $uid=TokenService::getCurrentUid();
         $user=UserModel::get($uid);

         $myCollect=$user->collect()->limit($start,$count)
             ->order('update_time desc,create_time desc')
             ->select();
         for ($l=0;$l<$myCollect->count();$l++)
         {
             $my=$myCollect[$l];
             $u=$my->getAttr('uid');

             if($uid==$u)
             {
                 $myCollect[$l]->setAttr('my',true);
                // $myCollect[$l]=$my;
             }
             else
             {
                 $myCollect[$l]->setAttr('my',false);
             }


         }


         if(!$myCollect)
         {
             throw new MissException(
                 ['msg' => '还没有任何收藏内容哦',
                     'errorCode' => 50000
                 ]);
         }


         return $myCollect->hidden(['pivot.create_time','pivot.update_time','pivot.uid','pivot.cid']);;


     }

    /**
     * 添加收藏
     */

     public function addCollect($id)
     {
         (new IDMustBePositiveInt())->goCheck();
         $uid=TokenService::getCurrentUid();
         $user=UserModel::get($uid);
         $user->collect()->attach($id);
         if($user)
         {
             return new SuccessMessage();
         }


     }
    /**
     * 取消收藏
     */
     public function noCollect($id)
     {
         (new IDMustBePositiveInt())->goCheck();
       $uid=TokenService::getCurrentUid();
         $user=UserModel::get($uid);
//         $con['uid']=$uid;
//         $con['cid']=$id;
        // CollectModel::destroy($con);
         $user->collect()->detach($id);
         if($user)
         {
             return new SuccessMessage();
         }

         //$user->collects()

     }


    /**
     * 添加或修改个人的恐惧建设
     * 根据是否有传ID号来区分
     */
    public  function addUserContent($id)
    {
        $validate=new ContentRule();//原来验证器没有检验过得数据是无法接受的

       $validate->goCheck();
       $uid=TokenService::getCurrentUid();
       $user=UserModel::get($uid);
        $data = $validate->getDataByRule(input('post.'));
       // $data=input('post.');
        //$data['fear']="242424";

        if($id=='undefined')
        {
            $user->content()->save($data);

        }
        else
        {
            $data['id']=$id;
            ContentModel::update($data);

        }

        return new SuccessMessage();
    }

    /**
     * 洽谈用户对于看到的一篇其他用户写的恐惧，可以添加预防措施，修补措施等内容
     */
    public  function addSome($choose)
    {
        $validate=new ContentV();
        $validate->goCheck();
        $uid=TokenService::getCurrentUid();
        $data = $validate->getDataByRule(input('post.'));
        $data['uid']=$uid;
        $content=ContentModel::get($data['fear_id']);
       // $choose=$data['partern'];
        if(!$content)
        {
            throw new MissException([
                'code' => 404,
                'msg' => '文章不存在',
                'errorCode' => 60001
            ]);
        }
        switch ($choose)
        {//为了适应picker的索引,对应关系的函数一改全部改
            case '0':$content->precautions()->save($data);break;
            case '1':$content->repairs()->save($data);break;
            case '2':$content->benefits()->save($data);break;
            case '3':$content->pays()->save($data);break;
        };
        return new SuccessMessage();

    }

    public  function deleteContentById($id)
    {
        (new IDMustBePositiveInt())->goCheck();
        $result=ContentModel::destroy($id);//使用软删除,delete没有静态方法
        PrecautionModel::destroy(['fear_id'=>$id]);
        BenefitModel::destroy(['fear_id'=>$id]);
        RepairModel::destroy(['fear_id'=>$id]);
        PayModel::destroy(['fear_id'=>$id]);

        if($result)
        return new SuccessMessage();
        //缺少一个操作失败的反馈信息

    }


    public function searchMyContentByFear($fear)
    {
        (new SearchRule())->goCheck();
        $uid=TokenService::getCurrentUid();
        $fears=ContentModel::searchMyFear($fear,$uid);
        if(!$fears)
        {
            throw new MissException(
                ['msg' => '还没有任何恐惧内容',
                    'errorCode' => 50000
                ]);
        }
        return $fears;
    }


    public function searchContentByFear($fear)
    {
        (new SearchRule())->goCheck();
        //$uid=TokenService::getCurrentUid();
        $fears=ContentModel::searchFear($fear);
        if(!$fears)
        {
            throw new MissException(
                ['msg' => '还没有任何恐惧内容',
                    'errorCode' => 50000
                ]);
        }
        return $fears;
    }
    public function comeToTop($id)
    {
        ContentModel::toTop($id);

    }

    public function noToTop($id)
    {
        ContentModel::noTop($id);

    }
    /**
     * 图片上传
     */
    public function uploadPic()
    {
        $file=request()->file('image');//为什么名字是image，这是客户端上传时的设定的key
        $info=$file->validate(['ext'=>'jpg,png,gif'])->move(ROOT_PATH . 'public' . DS . 'uploads'.DS . 'pic',true,false);
        if($info)
        {//搞不懂
            $url=$info->getSaveName();//返回的时一个字符串如："20181202\731404f5a685da514f8a6f598ae2c4fc.jpg"

            return $url;

        }
        else
        {
            return new UploadException();
        }


    }

















}