<?php


namespace app\api\validate;


class ContentV extends BaseValidate
{
    protected $rule=[
        'content'=>'require|IsNotEmpty',
        'privacy'=>'require',
        'fear_id'=>'require|isPositiveInteger'
    ];

}