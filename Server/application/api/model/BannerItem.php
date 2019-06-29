<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/17
 * Time: 20:23
 */

namespace app\api\model;


class BannerItem extends BaseModel
{
    protected $hidden=['id', 'img_id', 'banner_id', 'delete_time'];
    public function img()
    {
        return $this->belongsTo('image','img_id','id');
    }


}