// pages/consult/consult.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    supportList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSupport()
  },
  getSupport() {
    wx.request({
      url: app.URL + "/support",
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded"},
      data: {
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      success: res => {
        this.setData({
          supportList: res.data.data
        })
      }
    })
  },
  // 拨打电呼咨询
  consult() {
    wx.makePhoneCall({
      phoneNumber: this.data.supportList[1].supportDesc,
    })
  },
  // 拨打电话投诉
  complain() {
    wx.makePhoneCall({
      phoneNumber: this.data.supportList[2].supportDesc,
    })
  },

  turnSmart() {
    wx.navigateTo({
      url: "/pages/smartConsult/smartConsult",
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