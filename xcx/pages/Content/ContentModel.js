import { Base } from '../../utils/base.js';

class Content  extends Base {
  constructor() {
    super();
  }


  getContentData(id, callback,my) {
    var furl;
    if(my=='true')//不懂了，使用true都不对
    {
      furl = 'myContent/';
    }
    else
    {
      furl = 'content/'
    }
  
    var param = {
      url: furl+ id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getMyRecentFear(start, count, callback, eCallback = null)
  {
    var param = { 
      url: 'content/myRecent/' + start + '/' + count+'?XDEBUG_SESSION_START=11179',
     sCallback:function(data){
      callback&&callback(data);
    },
    eCallback:function(data){
      eCallback&&eCallback(data)
    }
    };
    this.request(param);

  }

  getMyCollect(start,count,callback,eCallback=null)
  {
    // /myCollect/:start /:count
    var param = {
      url: 'content/myCollect/' + start + '/' + count + '?XDEBUG_SESSION_START=13061',
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function (data) {
        eCallback && eCallback(data)
      }
    };
    this.request(param);

  }

  comeToTop(id)
  {
    var param = {
      url: 'comeToTop/'+id,
    };
    this.request(param);
  }

  noToTop(id) {
    var param = {
      url: 'noToTop/' + id,

    };
    this.request(param);

  }
  


};

export { Content };