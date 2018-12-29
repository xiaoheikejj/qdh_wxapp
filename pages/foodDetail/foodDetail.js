//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateAddress: "",
    cateGrade: 0,
    cateImgUrl: "",
    cateName: "",
    cateOpenTime: "",
    cateTel: "",
    cateType: "",
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
      url: `${app.URL}/cate/cateInfo`,
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
            cateAddress: data.cateAddress,
            cateGrade: data.cateGrade,
            cateImgUrl: data.cateImgUrl,
            cateName: data.cateName,
            cateOpenTime: data.cateOpenTime,
            cateTel: data.cateTel,
            cateType: data.cateType,
            slider: data.slider,
            serviceList: data.serviceList,
            longitude: data.longitude,
            latitude: data.latitude
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
      address: this.data.cateAddress,
      name: this.data.cateName
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.cateTel,
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