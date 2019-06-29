<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/14
 * Time: 15:25
 */

namespace app\api\controller\v1;
use \app\api\model\Banner as BannerModel;
use app\api\validate\IDMustBePositiveInt;
use app\lib\Exception\MissException;
use think\Db;


class Banner
{
    function getBanner($id)
    {
        (new IDMustBePositiveInt())->goCheck();
        $banner=BannerModel::getBannerById($id);
      // $v=$banner->getRelation();
       //var_dump($v);
        if(!$banner)
        {
            throw new MissException([
                'msg' => '请求banner不存在',
                'errorCode' => 40000
            ]);
        }
        return $banner;
       // $result=BannerModel::getBanner($id);

        //$result=Db::name('category')->order('id ','des')->select();
      //  $result=Db::table('category')->where('id','=','6')->value('name');
      //  $result=Db::name('category')->value('name');

     //   Db::name('category')->insert($data);
      // $result=Db::name('category')->where('name','冷食')->select();
  //  var_dump($result);
    }


}