// pages/Content/Content.js
import {
  Content
} from 'ContentModel.js';

var content = new Content();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parterns: ['预防', '补救', '好处', '不行动的代价'], //文章的各个章节部分
    key: 0, //用来标记当前所属的文章部分序号
    showAddIcon: false, //是否显示添加评论的icon
    imgMode: false,//点击图片之后只展示图片，默认为false，表示不展示
    imgUrl: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //其实可以把接受数据部分写成一个小模块,但是专门性太强了,复用性不大,就不写了
    var id = options.id; //options(当然也可以用其他的名字)
    //可以用来接受其他页面传过来的参数,这个是当前文章的id
    //有时候在文章的某个部分添加评论成功后,回来的时候要回到那各部分,这个时候可以传
    //key这个参数
    options.key && this.setData({
      key: options.key
    });
    this.data.id = id; //当然是把当前的文章id放到全局数据中,方便下面的操作
    this.data.my = options.my; //如果是从个人主页那边跳转过来的会携带一个参数，标志这篇文章，我可以看到去全部信息

    this._loadData();

  },

  _loadData: function() {
    var that = this;
    content.getContentData(this.data.id, (data) => {
      // console.log('the data from content:',data);
      that.setData({
        content: data[0], //我也搞不清楚为什么是data[0]不是data,我也是试出来的,难道是太长了
        loadingHidden: true //有内容之后需要把加载图标关闭
      });
    }, this.data.my); //把是否是我的标记传进去


  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this._loadData();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  // bindPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     keys: e.detail.value
  //   })
  // },


  bannerChange: function(e) {
    //console.log('BANNER发送选择改变，携带值为', e.detail.current)
    this.setData({
      key: e.detail.current
    })
  },

  //当点击添加图标后,执行的
  goToWrite: function(e) {
    this.setData({
      showAddIcon: true
    })

    // setTimeout(function () {

    //   wx.pageScrollTo({
    //     scrollTop: 300,
    //   })

    // }, 500)

  },

  goUp: function(e) {
    wx.pageScrollTo({
      scrollTop: 500,
    })

  },



  formSubmit: function(e) {
    var that = this;
    //获取当前被评论的文章的id
    e.detail.value.fear_id = content.getDataSet(e, 'id');
    //其实这里用!来判断是否为空可能不太正确...
    //后来使用正则表达式之后好多了
    //有空需要研究一下正则表达式
    e.detail.value.content = e.detail.value.content.replace(/(^\s+)|(\s+)/g, "")
    if (e.detail.value.content == '') {
      wx.showModal({
        title: '内容不能为空哦',
        content: '好好写哦',
        confirmColor: 'red',
        showCancel: false,
      });

    } 
    else 
    {
      //获取当前所添加部分的序号,并放入要提交的内容中
      e.detail.value.partern = this.data.key;
      var params = {
        'url': 'addSome/' + this.data.key,
        'type': 'post',
        'data': e.detail.value,
        'sCallback': function() {
          wx.showModal({
            title: '恭喜你，新增成功',
            content: '点击确定，即将返回原页面',
            confirmColor: 'blue',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../Content/Content?id=' + that.data.id + '&key=' + that.data.key,
                })

              }
            }

          })
        },
        'eCallback': function() {
          wx.showModal({
            title: '抱歉新增失败',
            content: '请稍后重试',
            confirmColor: 'blue',
            showCancel: false
          })


        }


      };
      content.request(params, true);
      that.setData({
        showAddIcon: false
      })

      console.log('form发生了submit事件，携带数据为：', e.detail.value);

    }


  },


  // onPullDownRefresh: function() {
  //   this._loadData();
  // },

 
  enterImg(event) {
    //有一个是currentTarget，需要了解一下两者的区别
    //以及 let和var 的区别
    //获取需要大图展示的图片url
    let url = event.target.dataset.src;
    this.setData({
      imgMode: true,
      imgUrl: url
    });
  },
  leaveImg(event) {
    this.setData({
      imgMode: false
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '解忧杂货铺-->>'+this.data.content.fear,
      path: 'pages/Content/Content'
    }

  }
})