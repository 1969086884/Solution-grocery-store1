<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/14
 * Time: 15:38
 */

namespace app\api\model;


use think\Model;

class Category extends BaseModel
{
    public function content()
    {
        return $this->hasMany('Content', 'type', 'id');
    }

    public function img()
    {
        return $this->belongsTo('Image', 'topic_img_id', 'id');
    }

    public static function getCategories()
    {
        $categories = self::with('content')
            ->with('img')->limit(9)
            ->select();
        return $categories;
    }

    public static function getCategory($id)
    {
        $category = self::with('content')->find($id);
        return $category;
    }



   // public static  function getCate()
  //  {
    //    return self::where('id','<>','1')->select();
    //}


}