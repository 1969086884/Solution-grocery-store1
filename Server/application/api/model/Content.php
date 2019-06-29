<?php
/**
 * Created by PhpStorm.
 * User: vb
 * Date: 2018/3/24
 * Time: 17:57
 */

namespace app\api\model;


use app\api\service\Token as TokenService;

class Content extends BaseModel
{


    public function repairs()
    {
        return $this->hasMany('Repair','fear_id','id');
    }
    public function precautions()
   {
      return $this->hasMany('Precaution','fear_id','id');
    }
    public function benefits()
    {
        return $this->hasMany('Benefit','fear_id','id');
    }
    public function pays()
    {
        return $this->hasMany('Pay','fear_id','id');
    }
    public function collects()
    {
        return $this->belongsToMany('User','Collect','uid','cid');
    }


    public function getUrlAttr($value, $data)
    {
        return $this->prefixImgUrl($value, $data,config('setting.BeforeUrl'));

    }

    public function getImgAttr($value,$data)
    {
        return $this->prefixImgUrl($value, $data,config('setting.ImgBeforeUrl'));

    }
    public function getCollectsAttr($value,$data)
    {
       // $uid=TokenService::getCurrentUid();
//       $uid=1;
////        if($value['privot']['uid']==$uid)
////        {
////            return 0;
////        }
////        else
//            return 2;



    }


    /**+
     * 在该用户自己的恐惧内容中查找 用fear关键字查找内容
     * @param $fear  查找的恐慌内容关键字
     * @param $uid
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public static function searchMyFear($fear,$uid)
    {
            return self::where('uid','=',$uid)
                ->where('fear','like','%'.$fear.'%')
                ->select();

    }

    /**+
     * 在所有公开的恐惧内容中查找 用fear关键字查找内容
     * @param $fear
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public static function searchFear($fear)
    {
        return self::where('privacy','=',1)
            ->where('fear','like','%'.$fear.'%')
            ->select();
    }

    /**+
     * 根据恐惧id,得到所有与之相关的内容，包括其他用户后面添加的内容
     * @param $id
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */

    public static function getContentOne($id)
    {
      //  return self::with('precaution','repair','benefit')->select($id);
        return self::with(['repairs'=>function($query){ $query->where('privacy','=',1);}
            ,'precautions'=>function($query){ $query->where('privacy','=',1);}
            ,'benefits'=>function($query){ $query->where('privacy','=',1);}
            ,'pays'=>function($query){ $query->where('privacy','=',1);}
        ])->select($id);
    }


    /**+
     * 用户自己在自己的恐怖列表中能看到自己具体的内容以及所有人的添加部分
     * @param $id
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public static function getMyContentOne($id)
    {//一定要是方括号
        return self::with(['precautions','repairs','benefits','pays'])->select($id);
        //return self::with('precautions','repairs','benefits')->p
    }

    /**+
     * //主要是获取id字段和fear字段
     * @param $start
     * @param $count
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public static function getMostRecent($start,$count)
    {
        $contents = self::with('collects')->where('privacy','=','1')
            ->order('create_time ','desc')->limit($start,$count)
            ->select();
        return $contents;
    }


    /**+
     * //主要是获取用户的内容列表，主要是获取id和fear字段，通过id来跳转到具体的一个内容
     * @param $uid
     * @param $start
     * @param $count
     * @return false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public static function getMyContent($uid,$start,$count)
    {
       $mycontent=self::with('collects')->where('uid','=',$uid)
         ->order('top desc,update_time desc,create_time desc')->limit($start,$count)->select();


        return $mycontent;
    }

    /**+
     * 主要是返回我收藏的恐惧内容

     */
    public static function getMycollect($uid,$start,$count)
    {
        $mycollect=self::where('uid','=',$uid)
            ->order('top desc,update_time desc,create_time desc')->limit($start,$count)->select();


        return $mycollect;
    }


    public static function AddContent($data)
    {


        //['repair','precaution','benefit']
       //
        // $content=Content::with('repair')->insert($data);
       //$result= self::with(['repair','precaution','benefit'])->($data);

      self::insert($data);
      // $result=self::get(1);
       //$result->precaution()->save($data);
      // return $result;



    }

    /**+
     * 恐慌内容置顶
     * @param $id
     */

    public static function toTop($id)
    {
          self::where('id','=',$id)->update(['top'=>1,'update_time'=>time()]);
    }

    public static function noTop($id)
    {
        self::where('id','=',$id)->update(['top'=>0]);
    }












}