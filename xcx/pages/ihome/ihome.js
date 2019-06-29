// pages/ihome/ihome.js
import { Home } from '../ihome/ihomemodel.js';
var home = new Home();
// var config=new Config();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,//一般默认隐藏加载图标
    typeName: ['学习', '生活', '其他'],//对于每一个人文章的类别转换0->学习
    totalCount: 0,//当前页面已经加载的文章数量
    end: true//标志文章是否全部加载完了,为ture时说明已经到低端了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    this._loadData();
  },

  /*加载所有数据*/
  _loadData: function (callback)
   {
    var that = this;//为了方便后面调用setData函数
    //因为在一个函数里面，this就有了新的身份
    // 获得bannar信息
    home.getBannerData((data) => {
      that.setData({
        bannerArr: data
      });
    });

    home.getContentFear(0, 10, (data) => {
      data.typeName = that.data.typeName;
      // if (data.fear.length > 7) {
      //   data.fear = data.fear.substring(0, 7) + '...'
      // }
      that.setData({
        fearsArr: data,
        totalCount: 10
      });
      console.log(data);//测试时用的
    });

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._loadData();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ end:true})

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },




  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  goToSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },


  onBannersItemTap: function (event) {
    var url = home.getDataSet(event, 'url');
    wx.navigateTo({
      url: '../webpage/webpage?url=' + url,
    });

  },

  onFearsItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../Content/Content?id=' + id
    })
  },

  onCollectTap:function(event){
    var that=this;
    var id = home.getDataSet(event, 'id');//获取被点击的文章id
    var collect = home.getDataSet(event, 'collect');//获取当前的收藏状态
    // console.log('collect');
    // console.log(collect);
    home.collect(id,
    (data)=>{
      that._loadData();//重新刷新页面
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

  onPullDownRefresh: function () {
    this._loadData(() => {
      wx.stopPullDownRefresh()
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.setData({ loadingHidden: false })

    home.getContentFear(that.data.totalCount, 10, (data) => {
      data.typeName = that.data.typeName;
      var totalFearArr = that.data.fearsArr
      // if (data.length<10)
      // {
      //   that.setData({ end: false })
      // }
      totalFearArr = totalFearArr.concat(data);
      that.setData({
        fearsArr: totalFearArr
      });
      that.data.totalCount = that.data.totalCount + 10;
      console.log("tail : " + that.data.totalCount)
      that.setData({ loadingHidden: true })
    },
      //获取数据失败后调用的方法
      (data) => {
        that.setData({
          end: false,
          loadingHidden: true
        })
        console.log('endhome:',that.data.end);
      })

  },

  /**
   * 用户点击右上角分享
   */
  //分享效果
  onShareAppMessage: function () {
    return {
      title: '解忧杂货铺',
      path: 'pages/ihome/ihome'
    }
  }
})