/**
 * Created by jimmy on 17/2/26.
 */

// var Base = require('../../utils/base.js').base;
import { Base } from '../../utils/base.js';

class Home extends Base {
  constructor() 
  {
    super();//调用基类的构造函数，不然会报错
  }

 

  /*banner图片信息*/
  getBannerData(callback) 
  {
    var that = this;
    var param = 
    {
      url: 'banner/1',
      sCallback: function (data) 
      {
        data = data.items;//这个为什么时items呢,是由于用到的字段就只有items
        callback && callback(data);
      }
    };
    this.request(param);
  }
  /*首页主题(当前没有用到)*/
  getCategoryData(callback) {
    var param = {
      url: 'category/',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  /*首页部分文章*/
  getContentFear(start,count,callback,eCallback=null) {
    var param = {
      url: 'content/recent/' + start + '/' + count + '?XDEBUG_SESSION_START=11179',
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback:function(data){
        eCallback && eCallback(data);
      }
    };
    this.request(param);
   // console.log('resqult'+result)
   //返回的结果为undefined
  }
};

export { Home };