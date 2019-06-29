<?php


namespace app\api\validate;


class ContentRule extends BaseValidate
{//缺少分类字段
    protected $rule=[
     'fear'=>'require|IsNotEmpty',
       'type'=>'require|in:0,1,2,3',
        'precaution'=>'length:0,400',
        'repair'=>'length:0,400',
        'benefit'=>'length:0,400',
        'privacy'=>'require',
         'img'=>'min:0',
        'pay'=>'length:0,400'


    ];

}