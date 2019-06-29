<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/14
 * Time: 15:17
 */

namespace app\api\model;


use think\Model;

class Banner extends BaseModel
{
    public function items()
    {
        //在数据库中表名其实为banner_item,后面在试试写一样的可以吗
        return$this->hasMany('BannerItem','banner_id','id');
    }
    public static function getBannerById($id)
    {
      $banner= self::with(['items','items.img'])->find($id);
      return $banner;
    }


}