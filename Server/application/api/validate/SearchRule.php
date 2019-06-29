<?php

namespace app\api\validate;


class SearchRule extends BaseValidate
{
  protected $rule=[
      'fear'=>'require|length:2,100|isNotEmpty'
  ];
}