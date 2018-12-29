//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    backgroundImg: "",  //背景图
    firstSeason: [],  //春夏季节
    secondSeason: []  //秋冬季节
  },

  /**
   * 这是分类请求成功后的函数
   * @params res 请求成功后所有的数据
   */
  successFunction(res) {
    if (res.code == 1) {
      const season = res.data;
      season.forEach(item => {
        if (item.id == 1) {
          item.seasonType ="spring"
        } else if (item.id == 2) {
          item.seasonType = "summer"
        } else if (item.id == 3) {
          item.seasonType = "autumn"
        } else if (item.id == 4) {
          item.seasonType = "winter"
        }
      })
      
      this.setData({
        backgroundImg: res.data[0].backImgUrl,
        firstSeason: res.data.slice(0, 2),
        secondSeason: res.data.slice(2, 4)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = app.URL + "/aroundview";
    var params = {
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFunction);

  },
  //跳转到
  fullViewTo: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: "/pages/fullViewDetail/fullViewDetail?type=" + type,
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