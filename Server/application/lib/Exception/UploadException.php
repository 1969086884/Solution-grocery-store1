<?php
/**
 * Created by PhpStorm.
 * User: 19690
 * Date: 2018/8/8
 * Time: 17:21
 */

namespace app\lib\Exception;


use app\api\validate\BaseValidate;

class UploadException extends BaseValidate
{
    public $code = 400;
    public $msg = '由于图片过大或者格式不对或者是其他原因引起的上传失败';
    public $errorCode = 999;
}