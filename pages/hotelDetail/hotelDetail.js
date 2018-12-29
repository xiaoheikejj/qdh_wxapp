//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelAddress: "",
    hotelGrade: 0,
    hotelImgUrl: "",
    hotelName: "",
    hotelDesc: "",
    hotelTel: "",
    hotelType: "",
    slider: [],
    serviceList: [],
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
    })
    wx.request({
      url: `${app.URL}/hotel/hotelInfo`,
      method: "post",
      data: {
        id: options.id,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: {"content-type": "application/x-www-form-urlencoded"},// 设置请求的 header
      success: res => {
        if (res.data.code == 1) {
          const data = res.data.data;          
          this.setData({
            hotelAddress: data.hotelAddress,
            hotelDesc: data.hotelDesc,
            hotelGrade: data.hotelGrade,
            hotelImgUrl: data.hotelImgUrl,
            hotelName: data.hotelName,
            hotelTel: data.hotelTel,
            hotelType: data.hotelType,
            slider: data.slider,
            serviceList: data.serviceList,
            latitude: data.latitude,
            longitude: data.longitude
          })
          wx.hideLoading()          
        }
      }
    })
  },

  openMap() {
    wx.openLocation({
      latitude: +this.data.latitude,
      longitude: +this.data.longitude,
      name: this.data.hotelName,
      address: this.data.address
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.hotelTel,
    })
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