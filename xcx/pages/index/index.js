//index.js
//获取应用实例
import { Content } from '../Content/ContentModel.js';
var content = new Content();
const app = getApp();
var iconPath = "/imgs/icon/"
var tabs = [
  {
    "icon": iconPath + "mark.png",
    "iconActive": iconPath + "markHL.png",
    "title": "烦恼", 
    "extraStyle": "",
  },
  {
    "icon": iconPath + "collect.png",
    "iconActive": iconPath + "collectHL.png",
    "title": "收藏",
    "extraStyle": "",
  },

];

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lock: false,
    tabs: tabs,
    typeName: ['学习', '生活', '其他'],
    I: true,
    loadingHidden: true,
    totalCount: 0,
    cTotalCount: 0,
    cLoadingHidden: true,
    cend: true,
    end: true,
    highLightIndex: 0,
    ty:['我的烦恼','我的收藏']

  },

  onLoad: function () {
    this._loadData();
    //console.log('kkk'+this.data.k);

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function () {
    this._loadData();
  },
  onHide: function () {
    this.setData({ end: true, cend: true })
  },



  _loadData: function (callback) {
    console.log('_load')
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.loadFears();

  },
  //事件处理函数


  loadFears: function () {
    var that = this;
    content.getMyRecentFear(0, 10, (data) => {
      that.setData({
        fearsArr: data,
        totalCount: 10
      });
    });
  },

  loadCollects: function () {
    var that = this;
    content.getMyCollect(0, 10, (data) => {
      that.setData({
        Arr: data,
        cTotalCount: 10
      });
      console.log('collects:', data)
    });

  },


  bindNew: function () {
    wx.navigateTo({
      url: '../AddMyContent/AddMyContent'
    })
  },

  bindfind: function () {
    wx.navigateTo({
      url: '../search/search?my=true',
    })
  },


  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    var that = this;
    if (this.data.highLightIndex == 0) {//选择的我的tap
      that.setData({//正在加载数据的loading
        loadingHidden: false,
      })
      

      content.getMyRecentFear(that.data.totalCount, 10, (data) => {
        // data.typeName = that.data.typeName;
        if (data.length < 10) {
          that.setData({ end: false })
        }
        var totalFearArr = this.data.fearsArr//把当前已经获取的内容放到一个临时变量中存储
        totalFearArr = totalFearArr.concat(data);//加上新获取的数据
        that.setData({//数据绑定，显示在前端界面
          fearsArr: totalFearArr
        });
        that.data.totalCount = that.data.totalCount + 10;//更新数据总数，方便下一次获取起始点的标记

        that.setData({ loadingHidden: true })//加载完数据之后隐藏loadding
      },
        //获取数据失败后调用的方法
        (data) => {//数据加载失败了说明数据到底了，所以也要把loading隐藏，同时显示底线
          that.setData({
            end: false,
            loadingHidden: true
          })
        })


    }
    else if (this.data.highLightIndex == 1) {//选择的收藏tap
      that.setData({ cLoadingHidden: false })

      content.getMyCollect(that.data.cTotalCount, 10, (data) => {
        if (data.length < 10) {
          that.setData({ cend: false })
        }
        data.typeName = that.data.typeName;
        var cTotalFearArr = this.data.Arr
        cTotalFearArr = cTotalFearArr.concat(data);
        that.setData({
          Arr: cTotalFearArr
        });
        that.data.cTotalCount = that.data.cTotalCount + 10;
        console.log("tailcccc : " + that.data.cTotalCount)
        that.setData({ cLoadingHidden: true })
      },
        //获取数据失败后调用的方法
        (data) => {
          console.log('cend:' + that.data.cend)
          that.setData({
            cend: false,
            cLoadingHidden: true
          })
        })

    }

  },


  ///////
  onFearsItemTap: function (event) {
    if (this.data.lock) {//这个lock变量是用于区分是点击操作还是长按操作
      //长按操作的时候不能触发点击操作
      return;
    }
    var id = content.getDataSet(event, 'id');
    var mym = content.getDataSet(event, 'my');
    if (!mym) var url = '../Content/Content?id=' + id + '&my=false'
    else var url = '../Content/Content?id=' + id + '&my=true'
    wx.navigateTo({
      url: url
    })
  },


  touchend: function () {
    if (this.data.lock) {
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }
  },

  onLongTapDelete: function (event) {
    var that=this;
    this.setData({ lock: true });//避免触发点击事件
    var id = content.getDataSet(event, 'id');
    // var fear = content.getDataSet(event, 'fear');用于获取内容
    wx.showActionSheet({
      itemList: ['你要进行编辑操作?', '你要进行删除操作?', '置顶', '取消置顶', '取消'],
      itemColor: '#39b5de',
      success: function (res) {
        if (res.tapIndex == 1) {
          var param =
            {
              url: 'deleteMyContent/' + id,
              sCallback: function (data) {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000,
                  complete: function () {
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }
                });
              },
              eCallback: function () {
                wx.showModal({
                  title: '删除失败',
                  content: '请稍后再重试',
                  showCancel: false,
                  confirmColor: 'yellow'
                })
              }
            }
          content.request(param);
        }
        else if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../AddMyContent/AddMyContent?id=' + id,
          })
        }
        else if (res.tapIndex == 2) {
          content.comeToTop(id);

        }

        else if (res.tapIndex == 3) {
          content.noToTop(id);
       

        }

        // var page = getCurrentPages().pop();
        // //if (page == undefined || page == null) return;
        // page.onLoad();
        //我也不太明白这个地方为什么要写两遍才能刷新
        that.loadFears()
        that.loadFears()
   
      
      },
      fail: function (res) {
        console.log(res.errMsg)
      }

    })


  },

  onCollectTap: function (event) {
    var that = this;
    var id = content.getDataSet(event, 'id');//获取被点击的文章id
    var collect = content.getDataSet(event, 'collect');//获取当前的收藏状态

    content.collect(id, (data) => {
      that.loadCollects();//重新刷新页面
      wx.showToast({
        title: '操作成功',
      })
     
    },
     (data)=>{
      wx.showToast({
        title: '操作失败',
        image:'/imgs/icon/Plus.png'
      })
    },
     collect);//把当前的收藏状态传进去

  },

  // 点击tab项事件
  touchTab: function (event) {
    var tabIndex = parseInt(event.currentTarget.id);
    console.log(tabIndex);
    if (tabIndex == 0) {
      this.loadFears();
    }
    else if (tabIndex == 1) {
      this.loadCollects();
    }

    this.setData({
      highLightIndex: tabIndex.toString()
    }
    );
  },




})
