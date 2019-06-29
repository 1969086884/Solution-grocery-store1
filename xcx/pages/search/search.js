// pages/search/search.js
import { Base } from '../../utils/base.js';
import { Home } from '../ihome/ihomemodel.js';
var base=new Base();

var home = new Home();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [], // 存储文章列表信息  
    searchLogList: [], // 存储搜索历史记录信息  
    hidden: true, // 控制没有结果这句话什么时候显示  
    scrollTop: 0, // 居顶部高度  
    inputShowed: false, // 搜索输入框是否显示  
    inputVal: "", // 搜索的内容  
    searchLogShowed: false, // 是否显示搜索历史记录  
    search:'搜索',
    typeName: ['学习', '生活', '其他'],
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.my);
    this.setData({my:options.my});
    if(this.data.my=='true')
    {
      this.setData({search:'搜索我的内容'});
    }
  
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 显示搜索输入框和搜索历史记录  
  showInput: function () {
    var that = this;
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
       // inputShowed: true,
        searchLogShowed: true,
        searchLogList: wx.getStorageSync('searchLog')
      });
    } else {
      that.setData({
       // inputShowed: true,
        searchLogShowed: true
      });
    }
  },

  // 显示搜索历史记录  
  searchLogShowed: function () {
    var that = this;
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
        searchLogShowed: true,
        searchLogList: wx.getStorageSync('searchLog')
      });
    } else {
      that.setData({
       searchLogShowed: true
      });
    }
  },


  // 点击 搜索 按钮后 隐藏搜索记录，并加载数据  
  searchData: function (e) {
    var that = this;
    that.setData({
      msgList: [],
      scrollTop: 0,
      searchLogShowed: false,
      hidden:false
    });
    var searchWord = e.detail.value;
    console.log(searchWord);
    if (searchWord == '') {
      wx.showModal({
        title: '搜索内容不能为空',
        content: '好好输入哦',
      });
    }
    else {
      console.log(this.data.my);
      base.getSearchData(searchWord,this.data.my, (data) => {
        that.setData({ msgList:data});
        console.log(data);
      }
      );


      var searchLogData = that.data.searchLogList;
      //console.log('ls');
      console.log(that.data.searchLogList);
      searchLogData.unshift(searchWord);
     // console.log(searchLogData);
      wx.setStorageSync('searchLog', searchLogData);
    }
  },
  //pageNum = 1;
  // loadMsgData(that);

  // 搜索后将搜索记录缓存到本地




  // 点击叉叉icon 清除输入内容，同时清空关键字，并加载数据  
  clearInput: function () {
    var that = this;
    that.setData({
      msgList: [],
      scrollTop: 0,
      inputVal: ""
    });
    
  },

  // 输入内容时 把当前内容赋值给 查询的关键字，并显示搜索记录  
  inputTyping: function (e) {
    var that = this;
    // 如果不做这个if判断，会导致 searchLogList 的数据类型由 list 变为 字符串  
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
        inputVal: e.detail.value,
        searchLogList: wx.getStorageSync('searchLog')
      });
    } else {
      that.setData({
        inputVal: e.detail.value,
        searchLogShowed: true
      });
    }
   
    console.log(e.detail.value);

  },



  // 通过搜索记录查询数据  
  searchDataByLog: function (e) {
    // 从view中获取值，在view标签中定义data-name(name自定义，比如view中是data-log="123" ; 那么e.target.dataset.log=123)  
    var searchWord= e.target.dataset.log;
    if (searchWord==null) return;
    var that = this;
    that.setData({
      msgList: [],
      inputVal: searchWord,
      scrollTop: 0,
      searchLogShowed: false,
      hidden:false
    });
    base.getSearchData(searchWord, this.data.my, (data) => {
      that.setData({ msgList: data });
      console.log(data);
      
    })
    var searchLogData = that.data.searchLogList;
    searchLogData.unshift(searchWord);//
    wx.setStorageSync('searchLog', searchLogData);
  
  },
  deleteone: function (e) {
    var id = base.getDataSet(e, 'id');
    var searchLogData = this.data.searchLogList;
    var newlog = [];
    var temp = 0;
    for (let i = 0; i < searchLogData.length; i++) {
      if (i == id)
      {
        continue;
      }
      
      newlog[temp] = searchLogData[i];
      temp++;
    }
   // console.log(newlog);
    wx.setStorageSync('searchLog', newlog);
    this.setData({ searchLogList: newlog });
    // console.log(base.getDataSet(e,'id'));
  },

  // 清楚搜索记录  
  clearSearchLog: function () {
    var that = this;
    wx.removeStorageSync("searchLog");
    that.setData({
      msgList: [],
      scrollTop: 0,
      searchLogShowed: false,
      hidden: true,
      searchLogList:[],
      
    });
  },  


  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  onFearsItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../Content/Content?id=' + id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})