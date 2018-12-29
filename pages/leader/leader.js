const app = getApp()

// pages/leader/leader.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo()
  },
  getUserInfo: function (e) {
    const userInfo = e.detail.userInfo;
    // 请求login
    const openID = wx.getStorageSync("openID").data;
    if (!openID) {
      return 123
    }
    wx.request({
      url: app.URL + "/login/login",
      method: "post",
      data: {
        userName: userInfo.nickName,
        userSex: userInfo.gender,
        userOpenID: wx.getStorageSync("openID").data,
        userCity: userInfo.city,
        userHeadImgUrl: userInfo.avatarUrl,
        userProvince: userInfo.province,
        userCountry: userInfo.country
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        // 积分
        wx.setStorageSync("userIntegral", res.data.data.userInfo.userIntegral);
        wx.setStorageSync("userInfo", e.detail.userInfo);
        wx.switchTab({
          url: "/pages/index/index"
        })
      }
    })
  },

  // 获取手机型号
  getSystemInfo() {
    const model = wx.getSystemInfoSync("model")
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