<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/14
 * Time: 12:56
 */

namespace app\lib\Exception;


use think\Exception;
use Throwable;

class BaseException extends Exception
{

    public $code = 400;
    public $msg = 'invalid parameters';
    public $errorCode = 999;
    public $more='null';

    public function __construct($params=[])
    {
        if(!is_array($params))
        {
            return;
        }
        if(array_key_exists('code',$params))
        {
            $this->code=$params['code'];

        }

        if(array_key_exists('msg',$params))
        {
            $this->msg=$params['msg'];
        }

        if(array_key_exists('errorCode',$params))
        {
            $this->errorCode=$params['errorCode'];
        }
    }


}