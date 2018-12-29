const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrl: "",
    avatarUrl: "",
    nickName: "",
    userIntegral: 0, //积分
    has_sign: false // 已签到
  },
  //点击会议打卡开启摄像头进行扫描
  scanCode() {
    wx.scanCode({
      success: res => {
        // 回调的结果
        const result = res.result;
        wx.request({
          url: app.URL + "/meeting/userMeeting",
          method: "post",
          header: {"content-type": "application/x-www-form-urlencoded"},
          data: {
            meetingID: result,
            userOpenID: wx.getStorageSync("openID").data,
            userName: wx.getStorageSync("userInfo").nickName,
            userHeadImgUrl: wx.getStorageSync("userInfo").avatarUrl
          },
          success: res =>{
            wx.showToast({
              title: "打卡成功",
              icon: "none",
              duration: 3000
            })
          }
        })
      }
    })
  },
  // 积分签到
  getIntegral() {
    wx.request({
      url: app.URL + "/login/getIntegral",
      method: "post",
      header: {"content-type": "application/x-www-form-urlencoded"},
      data: {
        userOpenID: wx.getStorageSync("openID").data
      },
      success: res => {
        const info = res.data;
        if (info.code == 0) {
          wx.showToast({
            title: "今天已经签到过了",
            icon: "none",
            duration: 3000
          })
        } else if (info.code == 1) {
          this.setData({
            userIntegral: this.data.userIntegral += 5,
            has_sign: true
          })
          wx.showToast({
            title: "签到成功",
            icon: "none",
            duration: 3000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // banner
    wx.request({
      url: app.URL + "/banner",
      method: "post",
      data: {
        bannerType: 4,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: {"content-type": "application/x-www-form-urlencoded"},// 设置请求的 header
      success: res => {
        if (res.data.code == 1) {
          const data = res.data;
          this.setData({
            bannerImgUrl: data.data[0].bannerImgUrl
          })
        }
      }
    })

    this.setData({
      userIntegral: wx.getStorageSync("userIntegral")
    })
  
    // 获取个人信息
    if (app.globalData.userInfo) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
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
  },
  // 收货地址
  turnToAddress() {
    // wx.navigateTo({
    //   url: "/pages/addressManager/addressManager",
    // })
    wx.navigateTo({
      url: "/pages/personInfo/personInfo",
    })
  },

  goDial() {
    wx.navigateTo({
      url: "/pages/integralActivity/integralActivity?type=dial",
    })
  },

  goCard() {
    wx.navigateTo({
      url: "/pages/integralActivity/integralActivity?type=card",
    })
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

  }
})