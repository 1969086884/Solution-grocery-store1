<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/17
 * Time: 20:33
 */

namespace app\lib\Exception;


class MissException extends BaseException
{
    public $code = 404;
    public $msg = 'global:your required resource are not found';
    public $errorCode = 10001;

}