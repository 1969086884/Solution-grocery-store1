
// import {类名} from 文件
import { Token } from 'token.js';
import { Config } from 'config.js';

class Base 
{
  constructor() {
    "use strict";
    this.baseRestUrl = Config.restUrl;//取得配置文件中前半段url
  }
  //通用的搜索功能，但是要区分是在全范围搜索，还是只搜索自己的
  //
  getSearchData(fear,my, callback) {
    var that = this;
    var url = 'searchFear/';
    if (my=='true')
    { url = 'searchMyFear/'; }

    var param =
     {
      url: url+fear,
      sCallback: function (data) 
      {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params, noRefetch) 
  {
    var that = this;
    var url = params.setUpUrl == 'false' ? params.url : this.baseRestUrl + params.url;
    wx.request({
      url: url,
      data: params.data,
      method: params.type||'get',
      header: 
      {
        'content-type': 'application/json;charset=UTF-8',
        'token': wx.getStorageSync('token')
        //从缓存中取得令牌
      },
      success: (res) =>
      {
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        var code = res.statusCode.toString();
        // charAt() 方法可返回指定位置的字符
        var startChar = code.charAt(0);
        if (startChar == '2') 
        {//以2开头则是正常返回，对正常返回的数据调用回调函数进行
        //处理
          params.sCallback && params.sCallback(res.data);
        }
        else
       {//如果是401，则看看是否设置为重发请求，若是则重发
       //401状态码：请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。
          if (code == '401') 
          {
            // 双重否定等于肯定
            if (!noRefetch) 
            {
              that._refetch(params);
            }
          }//最后则处理错误
          that._processError(res);
          // 调用失败后的回调方法
          params.eCallback && params.eCallback(res.data);
        }
      },
      fail: (err)=> {
    //  这个里面的只有调用接口失败才会执行，而不是返回了错误码就执行
        that._processError(err);
        params.eCallback && params.eCallback(err);
      },
      complete: (res) => {
        params.cCallback && params.cCallback (res)
      }
    });
  }

  _processError(err)
 {
    console.log(err);//发送请求失败则写入日志
 }

  _refetch(param) {
    var token = new Token();//重新生成令牌再次访问
    token.getTokenFromServer((token) => {
      this.request(param, true);
    });
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    //这个地方的是currentTarget，也有一个字段是target需要了解一下两者的区别
    return event.currentTarget.dataset[key];
  };
  
  getDataFrom(event,key)
  {
    //e.detail.value
    return event.detail.value[key];
  };

  collect(id, scallback,ecallback,collect)
  {
    var url;
    if(collect)
    {
      url = 'noCollect/'
    }
    else
    {
      url ='addCollect/'
    }
    var param = {
      url: url + id + '?XDEBUG_SESSION_START=18725',
      sCallback: function (data) {

        scallback && scallback(data);
      },
      eCallback:function(data){
        ecallback && ecallback(data);

      }
    };
    this.request(param)
  };


};

export { Base };
