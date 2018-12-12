// pages/xyx/xyx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isChecked: false,
    animationData: {},
    start: 1,
    timer: '', //定时器名字
    timers: '', //定时器名字
    startShow: false,
    countDownNum: '5', //倒计时初始值
    countDownNums: '65' //倒计时初始值
  },
  changeStart() {
    let _this = this;
    wx.request({
      url: 'https://nh.cnstleader.com/game/userstart',
      method: 'GET',
      success: function(res) {
        console.log(JSON.stringify(res.data) + '++++++++++++++2');
        if (res.data.code == 200) {
          _this.countDown();
          _this.setData({
            start: 2
          })
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })
  },
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function() { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          that.setData({
            start: 3
          })
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },
  countDowns: function() {
    let that = this;
    let countDownNums = that.data.countDownNums; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timers: setInterval(function() { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNums--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNums: countDownNums
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNums == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          // that.setData({
          //   start: 5
          // })
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timers);
          wx.request({
            url: 'https://nh.cnstleader.com/game/gameover',
            data: {
              openId: wx.getStorageSync('hengshunOppenId')
            },
            method: 'POST',
            success: function(res) {
              let data = res.data;
              that.setData({
                start: 4,
                countDownNum: '5', //倒计时初始值
                countDownNums: '65',
                score: data.data = '谢谢参与' ? data.data : '恭喜您获得第' + data.data + '名'
              })
              // if(data.code==200){
              //   that.setData({
              //     score: data.data = '恭喜您获得第' + data.data + '名'
              //   })
              // }else{
              //   that.setData({
              //     score: data.data = '恭喜您获得第' + data.data + '名'
              //   })
              // }
              // if (res.data.code == 200) {
              //   _this.countDown();
              //   _this.countDowns();
              //   _this.setData({
              //     start: 2,
              //     startShow: true
              //   })
              // } else {

              //   wx.showToast({
              //     title: res.data.data,
              //     icon: 'loading',
              //     duration: 2000
              //   })
              // }
            }
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    let _this = this;
    wx.connectSocket({
      url: "wss://nh.cnstleader.com/websocket/game/" + wx.getStorageSync('hengshunOppenId'),
    })

    //连接成功
    wx.onSocketOpen(function() {
      console.log('链接成功+++++++++++++++++++++++++++++++++++')
    })

    //接收数据
    wx.onSocketMessage((data) => {
      console.log(data);
      if (data.data == '游戏开始' && !_this.data.startShow) {
        wx.request({
          url: 'https://nh.cnstleader.com/game/userstart',
          method: 'GET',
          success: function(res) {
            if (res.data.code == 200) {
              _this.countDown();
              _this.countDowns();
              _this.setData({
                start: 2,
                startShow: true
              })
            } else {

              wx.showToast({
                title: res.data.data,
                icon: 'loading',
                duration: 2000
              })
            }
          }
        })
      }
    })

    //连接失败
    wx.onSocketError(function() {
      console.log('websocket连接失败！');
    })
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
    var that = this;
    this.isShow = true;
    // wx.onAccelerometerChange(function (res) {
    //   console.log(res.x)
    //   console.log(res.y)
    //   console.log(res.z)
    // })    
    wx.onAccelerometerChange(function(e) {
      if (!that.isShow) {
        return
      }
      // console.log(e.x)
      // console.log(e.y)
      // console.log(e.z)
      if (that.data.start == 3) {
        if (e.x > 0.2 || e.y > 0.2) {
          wx.vibrateLong();
          that.setData({
            motto: 'bianla',
            a: that.a + 1
          })
          that.rotateThenScale()
          wx.request({
            url: 'https://nh.cnstleader.com/game/shake',
            // data: { id: app.globalData.userInfo['OPEN_ID']},
            data: {
              openId: wx.getStorageSync('hengshunOppenId')
            },
            method: 'POST',
            success: function(res) {
              if (res.data.isWin) {
                that.setData({
                  start: 4,
                  countDownNum: '5', //倒计时初始值
                  score: res.data.rank,
                })
                // wx.showToast({
                //   title: '第' +  + '名',
                //   icon: 'loading',
                //   duration: 2000
                // })
              }
              // app.globalData.userInfo['OPEN_ID'] = res.data.openid;
              // app.globalData.userInfo['SESSION_KEY'] = res.data.session_key;        
            }
          })
          // wx.showToast({
          //   title: '摇一摇成功',
          //   icon: 'success',
          //   duration: 2000
          // })
        }
      }

    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
    })

    this.animation = animation
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.isShow = false;
    console.log('sss');
    this.setData({
      start: 1
    })
  },
  onUnload: function() {
    this.isShow = false;
    console.log('sss');
    this.setData({
      start: 1
    })
    console.log(1)
    wx.closeSocket()
  },
  rotateAndScale: function() {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function() {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.rotate(-45).step()
    this.animation.rotate(0).step()
    // this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function() {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({
      duration: 1000
    })
    this.setData({
      animationData: this.animation.export()
    })
  }
})