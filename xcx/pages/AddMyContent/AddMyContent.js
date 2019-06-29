// pages/AddMyContent/AddMyContent.js
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
import { Content } from '../Content/ContentModel.js';
var base = new Base();
// var config=new Config();
var content = new Content();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenModal: true,
    current: 0,//标志当前所处于的文章部分序号
    index: 0,//初始化选择类型
    ediType: false,//标记试新增,还是已有编辑,false为新增
    showValues: false,
    imgPath: '',//先用来暂时存储选择的图片的地址,方便上传
    typeName: ['学习', '生活', '其他']
  },

  swiperChangeEnd: function (e) {
    console.log('swiper index:', e.detail.current);
   // this.data.ediType =!this.data.ediType;
    this.setData({ ediType: !this.data.ediType})
    console.log('edi :', this.data.ediType);
    
  
   

    // if (e.detail.current == 4 && this.data.imgPath == '') {
    //   var that = this;
    //   wx.chooseImage({
    //     count: 1,
    //     success: function (res) {
    //       that.setData({
    //         imgPath: res.tempFilePaths
    //       });


    //       console.log('pathimg:', that.data.imgPath);
    //     },
    //   })
    // }
    // this.setData({
    //   current: e.detail.current
    // });






  },

  chooseImgAgain: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          imgPath: res.tempFilePaths//图片的本地临时文件路径列表，是一个数组型的哦，这就解释了下文为什么要用data[0]来获取第一张图片的路径
        })
      },
      //当打开了图片列表，又没有选择图片的时候也会触发fail函数，所以不打算用这个了
      // fail:function(res){
      //   wx.showModal({
      //     title: '选择失败,请稍后重试',
      //     content: '抱歉哦',
      //   })
      // }
    })
  },
// 用来选择所添加文章的类别
  chooseContentType: function (e) {
    this.setData({
      index: e.detail.value,
    })

  },

// 先把图片上传到服务器，然后获取服务器图片的保存路径，之后再把图片路径连同其他填写的信息返回给服务器写入数据库中
  formSubmit: function (e) {
    var that = this;
    // e.detail.value.type = 1;//因为现在还没有类型选定，之后再动态设置
    // e.detail.value.fear="tjdfg";
    e.detail.value.fear = e.detail.value.fear.replace(/(^\s+)|(\s+)/g, "");
    if (e.detail.value.fear != '') {
      if (that.data.imgPath!="") {
        wx.uploadFile({
          url: Config.restUrl +'uploadPic/',
          filePath: that.data.imgPath[0],//为什么要加个[0]，看上文选择图片的事件函数
          name: 'image',//文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
          success: function (res) {
            // console.log('img url from server :',res);
            var da = res.data.substring(1, res.data.length - 1);//不知道为什么会出现串中串
            //这里主要用substring来截取前面和后面的双引号
            e.detail.value.img = '\\\\' + da;//保存到服务器上面的图片貌似大部分都只保存了一半的url，等到需要展示图片的时候才拼完整
            var params = {
              'url': 'addUserContent?id=' + that.data.id,
              'type': 'post',
              'data': e.detail.value,
              'sCallback': function () {
                wx.showModal({
                  title: '恭喜你，操作成功',
                  content: '点击确定，即将返回个人页面',
                  confirmColor: 'blue',
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({});
                    }
                  }
                })
              },
              'eCallback':function(){
                wx.showModal({
                  title: '抱歉，新增失败',
                  content: '请稍后重试哦',
                })

              }

            };

            base.request(params, true);
          }

        })
      }
      else
      {
        //that.data.content.img保存的是之前选择的文章图片在服务器上的路径路径，
        //因为有可能出现用户在编辑的时候，放弃原来的图片，选新图片的情况
        //但又有可能选了又没选的情况
        //所以需要保存前一张图片的路径，重新上传服务器
        if (!e.detail.value.hasOwnProperty("img"))
        {
           e.detail.value.img=that.data.content.img.split("pic")[1]
           
           console.log('e.img ' + e.detail.value.img)

        }
       
        console.log('content.img   ' + that.data.content.img)
        var params = {
          'url': 'addUserContent?id=' + that.data.id,
          'type': 'post',
          'data': e.detail.value,
          'sCallback': function () {
            wx.showModal({
              title: '恭喜你，操作成功',
              content: '点击确定，即将返回个人页面',
              confirmColor: 'blue',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({});
                }
              }
            })
          },
          'eCallback': function () {
            wx.showModal({
              title: '抱歉，新增失败',
              content: '请稍后重试哦',
            })

          }

        };

        base.request(params, true);
      }

    }
    else {
      wx.showToast({
        title: 'fear不能为空',
        image: '/imgs/icon/pay@error.png'
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id != 'undefined')//新增的时候就不传值
      this.setData({ id: options.id });//编辑的时候就得要接受其他页面传过来得文章id，方便下文操作
    this._LoadData();

  },


  _LoadData: function () {
    var that = this;
    content.getContentData(this.data.id, (data) => {
      that.setData({
        content: data[0],//这个地方为什么是DATA[0],我自己其实也不太清楚
        //也是一步步试出来的
      });
      // console.log('index' + this.data.index);
    }, this.data.my);

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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  listenerConfirm: function (event) {
    this.setData({
      hiddenModal: true
    });

  },




})