import {
  $init,
  $digest
} from '../../utils/common.util'
const app = getApp();
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    toView: 'red',
    imgUrl: null,
    titleCount: 0, //标题字数
    contentCount: 0, //正文字数
    title: '', //标题内容
    content: '', //正文内容
    images: [],
    showData: [],
    pageSize: 10,
    color: '#fff',

    colorArray: ['red', 'blue', 'yellow', 'green', '#fff']
  },
  bindtap0() {
    this.setData({
      color: 'red',
    })
  },
  bindtap1() {
    this.setData({
      color: 'blue',
    })
  },
  bindtap2() {
    this.setData({
      color: 'yellow',
    })
  },
  bindtap3() {
    this.setData({
      color: 'green',
    })
  },
  bindtap4() {
    this.setData({
      color: '#fff',
    })
  },

  showDataIms: function(event) {
    // var src = event.currentTarget.dataset.src; //获取data-src
    // var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    console.log(event.currentTarget.dataset.src)
    wx.previewImage({
      current: event.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [event.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  upper: function(e) {
    let _this = this;
    this.setData({
      pageSize: this.data.pageSize + 10
    })
    wx.showNavigationBarLoading();
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    wx.request({
      url: 'https://nh.cnstleader.com/barrage/findall',
      data: {
        cp: 1,
        pageSize: this.data.pageSize
      },
      method: 'GET',
      success: function(res) {
        function isJSON(str) {
          if (typeof str == 'string') {
            try {
              var obj = JSON.parse(str);
              if (typeof obj == 'object' && obj) {
                return true;
              } else {
                return false;
              }

            } catch (e) {
              console.log('error：' + str + '!!!' + e);
              return false;
            }
          }
        }
        var arr = _this.data.showData;
        res.data.data.list.slice(_this.data.pageSize - 10).forEach(v => {
          if (isJSON(v.content)) {
            arr.unshift(JSON.parse(v.content));
          }
        })
        var len = arr.length //遍历的数组的长度
        _this.setData({
          showData: arr,
          // scrollTop: 1000 * len,
          imgUrl: null,
          title: ''
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  lower: function(e) {

  },
  scroll: function(e) {

  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  onLoad(options) {

    $init(this);
    //建立连接
    let _this = this;
    wx.connectSocket({
      url: "wss://nh.cnstleader.com/websocket/" + wx.getStorageSync('hengshunOppenId'),
    })

    //连接成功
    wx.onSocketOpen(function() {


      // wx.sendSocketMessage({
      //   data: 11,
      // })
    })

    //接收数据
    wx.onSocketMessage(function(data) {

      var arr = _this.data.showData;
      arr.push(JSON.parse(data.data));
      console.log(JSON.parse(data.data))
      var len = arr.length //遍历的数组的长度
      _this.setData({
        showData: arr,
        scrollTop: 1000 * len,
        imgUrl: null,
      })

    })

    //连接失败
    wx.onSocketError(function() {
      console.log('websocket连接失败！');
    })
    wx.request({
      url: 'https://nh.cnstleader.com/barrage/findall',
      data: {
        cp: 1,
        pageSize: this.data.pageSize
      },
      method: 'GET',
      success: function(res) {
        function isJSON(str) {
          if (typeof str == 'string') {
            try {
              var obj = JSON.parse(str);
              if (typeof obj == 'object' && obj) {
                return true;
              } else {
                return false;
              }

            } catch (e) {
              console.log('error：' + str + '!!!' + e);
              return false;
            }
          }
          console.log('It is not a string!')
        }
        var arr = _this.data.showData;
        console.log(res.data.data.list)
        res.data.data.list.forEach(v => {
          if (isJSON(v.content)) {
            arr.unshift(JSON.parse(v.content));
          }
        })
        var len = arr.length //遍历的数组的长度
        _this.setData({
          showData: arr,
          // scrollTop: 1000 * len,
          imgUrl: null,
          title: ''
        })
      }
    })
  },
  onShow: function() {

  },

  onUnload: function() {
    wx.closeSocket()
  },
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length //计算已输入的标题字数
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length //计算已输入的正文字数
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.images = images.length <= 1 ? images : images.slice(0, 1)
        $digest(this)
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  submitForm(e) {
    let dateServer = value => {
      var d = new Date(value);
      var year = d.getFullYear();
      var month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate();
      var hour = d.getHours();
      hour = hour > 9 ? hour : "0" + hour;
      var minutes = d.getMinutes();
      minutes = minutes > 9 ? minutes : "0" + minutes;
      var seconds = d.getSeconds();
      seconds = seconds > 9 ? seconds : "0" + seconds;
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds
      );
    }
    console.log(app.globalData.name);
    var msg = {
      // nickName: app.globalData.userInfo.nickName,
      nickName: wx.getStorageSync('hengshunName'),
      avatarUrl: app.globalData.userInfo.avatarUrl,
      gender: app.globalData.userInfo.gender,
      data: this.data.title,
      imgUrl: this.data.imgUrl ? this.data.imgUrl : null,
      time: dateServer(new Date()),
      color: this.data.color
    }
    if (this.data.imgUrl || this.data.title) {
      wx.sendSocketMessage({
        data: JSON.stringify(msg),
      })
      this.setData({
        title: ''
      })
    } else {

    }


  },
  uploadFile: function() {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有        
      success: function(res) {

        var path = res.tempFilePaths[0];
        console.log(path);
        console.log(path);
        wx.uploadFile({
          url: 'https://nh.cnstleader.com/barrage/upload?openId=u20',
          filePath: path,
          header: {
            "Content-Type": "multipart/form-data"
          },
          name: 'file',
          formData: {
            name: 'logoName'
          },
          success: function(res) {
            _this.setData({
              imgUrl: JSON.parse(res.data).data,
              title: ''
            })
          },
          fail: function(res) {
            let data = {
              "code": 200,
              "msg": "提交成功",
              "data": "http://cdn.jd.tiqianfu.com/images/1543368114605.png"
            }
          }
        })
      },
    })

  },
  // // 下拉刷新
  // onPullDownRefresh: function() {
  //   // 显示顶部刷新图标
  //   wx.showNavigationBarLoading();
  //   var that = this;
  //   wx.request({
  //     url: 'https://xxx/?page=0',
  //     method: "GET",
  //     header: {
  //       'content-type': 'application/text'
  //     },
  //     success: function(res) {
  //       that.setData({
  //         moment: res.data.data
  //       });
  //       // 设置数组元素
  //       that.setData({
  //         moment: that.data.moment
  //       });
  //       console.log(that.data.moment);
  //       // 隐藏导航栏加载框
  //       wx.hideNavigationBarLoading();
  //       // 停止下拉动作
  //       wx.stopPullDownRefresh();
  //     }
  //   })
  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function() {
  //   var that = this;
  //   // 显示加载图标
  //   wx.showLoading({
  //     title: '玩命加载中',
  //   })
  //   // 页数+1
  //   page = page + 1;
  //   wx.request({
  //     url: 'https://xxx/?page=' + page,
  //     method: "GET",
  //     // 请求头部
  //     header: {
  //       'content-type': 'application/text'
  //     },
  //     success: function(res) {
  //       // 回调函数
  //       var moment_list = that.data.moment;

  //       for (var i = 0; i < res.data.data.length; i++) {
  //         moment_list.push(res.data.data[i]);
  //       }
  //       // 设置数据
  //       that.setData({
  //         moment: that.data.moment
  //       })
  //       // 隐藏加载框
  //       wx.hideLoading();
  //     }
  //   })

  // }
})