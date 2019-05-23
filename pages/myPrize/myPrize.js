const app = new getApp()

// pages/myPrize/myPrize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_prize: false,
    advent_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获奖列表
   */
  getAdventList() {
    let url = `${app.URL}/login/getAdventInfoList`,
      params = {
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      };
    app.request(url, 'post', params).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        return false
      }
      res.data.forEach(item => {
        item.getDate = item.getDate.split(".0")[0]
      })
      let hasPrize = false;
      hasPrize = res.data.length !== 0 ? true : false;
      this.setData({
        advent_list: res.data,
        has_prize: hasPrize
      })
    }).catch(err => {
      app.showError(err)
    })
  },

  // 选择地址
  selectAddress() {
    wx.navigateTo({
      url: "/pages/addressManager/addressManager",
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
    wx.showLoading({
      title: "加载中",
    })
    this.getAdventList()
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
    return {
      title: "千岛湖小程序",
      path: "/pages/leader/leader"
    }
  }
})