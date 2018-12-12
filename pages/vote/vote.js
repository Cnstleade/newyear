Page({
  data: {
    num: 0,
    numArr: []
  },
  checkboxChange: function(e) {
    let num = this.data.num;
    if (e.detail.value.length == num) {
      var arr = this.data.items;
      arr.forEach(v => {
        v['show'] = false;
        e.detail.value.forEach(s => {
          if (!v['show']) {
            if (s == v['id']) {
              v['diasbled'] = false;
              v['checked'] = true;
              v['show'] = true;
            } else {
              v['diasbled'] = true;
            }
          }
        })
      })
      this.setData({
        items: arr
      })
    }
    if (e.detail.value.length < num) {
      var arr = this.data.items;
      arr.forEach(v => {
        v['show'] = false;
        v['diasbled'] = false;
        v['checked'] = false;
        e.detail.value.forEach(s => {
          if (!v['show']) {
            if (s == v['id']) {
              v['checked'] = true;
              v['show'] = true;
            }
          }
        })
      })
      this.setData({
        items: arr
      })
    }
    this.setData({
      vote: e.detail.value
    })
  },
  onShow: function() {
    let _this = this;
    // wx.request({
    //   url: 'https://nh.cnstleader.com/vote/init ',
    //   method: 'POST',
    //   // header: {
    //   //   "content-type": "application/x-www-form-urlencoded"
    //   // },
    //   success: (res) => {

    //   }
    // })    
    wx.request({
      url: 'https://nh.cnstleader.com/votecheck',
      method: 'POST',
      // header: {
      //   "content-type": "application/x-www-form-urlencoded"
      // },
      data: {
        openId: wx.getStorageSync('hengshunOppenId'),
      },
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            num: res.data.data.voteNumLeft
          })
        } else {
          this.setData({
            num: 0
          })
        }
      }
    })
    wx.request({
      url: 'https://nh.cnstleader.com/getScore',
      data: {
        openId: wx.getStorageSync('hengshunOppenId')
      },
      method: 'POST',
      success: (res) => {
        var arr = [];
        res.data.lists.map(v => {
          return v['diasbled'] = false
        })
        res.data.lists.map(v => {
          return v['checked'] = false
        })
        wx.request({
          url: 'https://nh.cnstleader.com/votecheck',
          method: 'POST',
          data: {
            openId: wx.getStorageSync('hengshunOppenId'),
          },
          success: (ress) => {
            if (ress.data.code == 200) {
              _this.setData({
                num: ress.data.data.voteNumLeft,
                numArr: ress.data.data.vote ? ress.data.data.vote.split(',') : []
              })
              _this.data.numArr.forEach((v, vi) => {
                res.data.lists.forEach((s, si) => {
                  if (s.id == v) {
                    res.data.lists.splice(si, 1)
                  }
                })
              })
              console.log(res.data.lists);
              _this.setData({
                items: res.data.lists
              })
            } else {
              _this.setData({
                num: 0,
              })
            }

          }
        })

      }
    })
  },
  vote: function() {
    let _this = this;
    wx.request({
      url: 'https://nh.cnstleader.com/vote',
      method: 'POST',
      data: {
        "openId": wx.getStorageSync('hengshunOppenId'),
        "targets": this.data.vote.join(',')
      },
      success: (res) => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '投票成功',
            icon: 'success',
            duration: 2000
          })
          wx.request({
            url: 'https://nh.cnstleader.com/votecheck',
            method: 'POST',
            // header: {
            //   "content-type": "application/x-www-form-urlencoded"
            // },
            data: {
              openId: wx.getStorageSync('hengshunOppenId'),
            },
            success: (ress) => {
              if(ress.data.code==200){
                _this.setData({
                  num: ress.data.data.voteNumLeft,
                  numArr: ress.data.data.vote ? ress.data.data.vote.split(',') : []
                })
                console.log(this.data.numArr);
                let items = this.data.items;
                _this.data.numArr.forEach((v, vi) => {
                  items.forEach((s, si) => {
                    if (s.id == v) {
                      items.splice(si, 1)
                    }
                  })
                })
                console.log(items);
                _this.setData({
                  items: items
                })
              }else{
                _this.setData({
                  num: 0,
                  numArr: [],
                  items:[]
                })
              }

            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })
  }
})