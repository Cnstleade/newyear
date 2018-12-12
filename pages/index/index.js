//index.js
//获取应用实例
const app = getApp()
const APP_ID = 'wxef3b0a79b2dafe06'; //输入小程序appid  
const APP_SECRET = 'd27bad925bfea199d0540f04abc097ec'; //输入小程序app_secret  
var OPEN_ID = '' //储存获取到openid  
var SESSION_KEY = '' //储存获取到session_key
Page({
  isShow: false,
  login() {
    let that = this;

    wx.request({
      url: 'https://nh.cnstleader.com/user/sign_out',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      // data: { id: app.globalData.userInfo['OPEN_ID']},
      data: {
        id: wx.getStorageSync('hengshunId'),
      },
      method: 'POST',
      success: function(res) {
        wx.clearStorage()
        that.setData({
          hasUserInfo: false,
          userInfo: {},
          inputPhoneValue: '',
          inputNameValue: '',
        });
        app.globalData.userInfo = {}
      }
    })
  },
  goDm() {
    wx.navigateTo({
      url: '/pages/dm/dm',
    })
  },
  goTp() {
    wx.navigateTo({
      url: '/pages/vote/vote',
    })
  },
  goXyx() {
    //this.getOpenIdTap();
    // wx.request({
    //   url: 'https://nh.cnstleader.com/prize/noprize',
    //   method: 'GET',
    //   success: function(res) {}
    // })
    // wx.request({
    //   url: 'https://nh.cnstleader.com/game/clear',
    //   method: 'GET',
    //   success: function(res) {}
    // })

    wx.request({
      url: 'https://nh.cnstleader.com/game/init',
      // data: { id: app.globalData.userInfo['OPEN_ID']},
      data: {
        openId: wx.getStorageSync('hengshunOppenId')
      },
      method: 'POST',
      success: function(res) {
        console.log(JSON.stringify(res) + '++++++++++++++2');
        // app.globalData.userInfo['OPEN_ID'] = res.data.openid;
        // app.globalData.userInfo['SESSION_KEY'] = res.data.session_key;  
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/xyx/xyx',
          })
        }
        wx.showToast({
          title: res.data.code == 200 ? res.data.msg : '游戏尚未启动',
          icon: res.data.code == 200 ? 'success' : 'loading',
          duration: 1000
        })
      }
    })

  },
  data: {
    a: 1,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputPhoneValue: '',
    inputNameValue: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this;
    let _this = this;
    this.isShow = true;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log(JSON.stringify(res) + '+++++++++')
          _this.setData({
            code: res.code
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    wx.request({
      url: 'https://nh.cnstleader.com/user/find_user_openid_now',
      data: {
        openId: wx.getStorageSync('hengshunOppenId')
      },
      method: 'GET',
      success: function(res) {
        if (res.data.code == 200) {
          if (app.globalData.userInfo) {
            _this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
            })
          } else if (_this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
              console.log(res.userInfo + '++++++++1');
              _this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
              success: res => {
                console.log(res.userInfo + '++++++++2')
                app.globalData.userInfo = res.userInfo;

                _this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                })
              }
            })
          };

        } else {
          wx.clearStorage()
          that.setData({
            hasUserInfo: false,
            userInfo: {}
          });
          app.globalData.userInfo = {}
        }
      }
    })

    // wx.request({
    //   url: 'https://nh.cnstleader.com/user/update_user',
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   // data: { id: app.globalData.userInfo['OPEN_ID']},
    //   data: {
    //     id: 8,
    //     openId:'tt8'
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     wx.clearStorage()
    //     that.setData({
    //     })
    //   }
    // })

    // wx.request({
    //   url: 'https://nh.cnstleader.com/barrage/findall',
    //   // data: { id: app.globalData.userInfo['OPEN_ID']},
    //   data: {
    //     cp: 1,
    //     pageSize: 999
    //   },
    //   method: 'GET',
    //   success: function(res) {

    //   }
    // })


  },
  getUserInfo: function(e) {
    let _this = this;
    if (this.data.inputNameValue == '' || this.data.inputPhoneValue == '') {
      wx.showToast({
        title: '请补全信息',
        icon: 'loading',
        duration: 500
      })
      return
    }
    this.hideModal();
    app.globalData.userInfo = e.detail.userInfo;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log(JSON.stringify(res) + '+++++++++')
          _this.setData({
            code: res.code
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    let data = {
      // encryptedData: e.detail.encryptedData,
      // iv: e.detail.iv,
      code: this.data.code,
      photo: e.detail.userInfo.avatarUrl,
      gender: e.detail.userInfo.gender,
      nickname: e.detail.userInfo.nickName,
      name: this.data.inputNameValue,
      phone: this.data.inputPhoneValue,
    }

    //this.getOpenIdTap();
    wx.request({
      url: 'https://nh.cnstleader.com/wx/user/wxef3b0a79b2dafe06/login',
      data: data,
      method: 'GET',
      success: function(res) {
        if (res.data.code == 200) {
          _this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo['OPEN_ID'] = JSON.parse(res.data.json).openid;
          app.globalData.userInfo['SESSION_KEY'] = JSON.parse(res.data.json).sessionKey;
          app.globalData.name = data.name;
          wx.setStorageSync('hengshunOppenId', JSON.parse(res.data.json).openid)
          wx.setStorageSync('hengshunId', res.data.userinfosVo.id)
          wx.setStorageSync('hengshunName', data.name)
        } else if (res.data.code == 303 ) {
          wx.showToast({
            title: '用户已登录',
            icon: 'loading',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '无权限',
            icon: 'loading',
            duration: 2000
          })
        }

      }
    })
  },
  onShow: function() {
    // let that = this;
    // wx.request({
    //   url: 'https://nh.cnstleader.com/user/sign_out',
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   // data: { id: app.globalData.userInfo['OPEN_ID']},
    //   data: {
    //     id: 1,
    //   },
    //   method: 'POST',
    //   success: function(res) {
    //     wx.clearStorage()
    //     that.setData({
    //       hasUserInfo: false
    //     });
    //     app.globalData.userInfo = {}
    //   }
    // })
    // wx.request({
    //   url: 'https://nh.cnstleader.com/getScore',
    //   method: 'GET',
    //   success: (res) => {
    //     console.log(JSON.stringify(res) + '++++++++++++++3');
    //     this.setData({
    //       da: res.data.lists[0].name
    //     })
    //   }
    // })
  },
  onHide: function() {
    this.isShow = false;
  },
  getOpenIdTap: function() {
    var that = this;
    console.log('+++++++++++');
    wx.login({
      success: function(res) {
        wx.request({
          //获取openid接口  
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: APP_ID,
            secret: APP_SECRET,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function(res) {
            console.log(res.data)
            OPEN_ID = res.data.openid; //获取到的openid  
            SESSION_KEY = res.data.session_key; //获取到session_key  
            app.globalData.userInfo['OPEN_ID'] = res.data.openid;
            app.globalData.userInfo['SESSION_KEY'] = res.data.session_key;
            app.globalData.userInfo['code'] = res.code;
            that.setData({
              userInfo: app.globalData.userInfo,
            })
            that.setData({
              openid: res.data.openid.substr(0, 10) + '********' + res.data.openid.substr(res.data.openid.length - 8, res.data.openid.length),
              session_key: res.data.session_key.substr(0, 8) + '********' + res.data.session_key.substr(res.data.session_key.length - 6, res.data.session_key.length)
            })
          }
        })
      }
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {

    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  inputTextChange(e) {
    console.log(e.detail.value)
    this.setData({
      inputNameValue: e.detail.value
    })
  },
  inputChange(e) {
    console.log(e.detail.value)
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    // wx.showToast({
    //   title: '提交成功',
    //   icon: 'success',
    //   duration: 2000
    // })
    this.hideModal();
  }
})