<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/17
 * Time: 20:52
 */

namespace app\api\model;


use think\Model;

class image extends BaseModel
{
    protected $hidden = ['delete_time', 'id', 'from'];

    public function getUrlAttr($value, $data)
    {
       return $this->prefixImgUrl($value, $data,config('setting.BeforeUrl'));
       // return 'sdfsf';
    }

}