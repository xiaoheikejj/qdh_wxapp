const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList() {
    const userInfo = wx.getStorageSync("userInfo");
    wx.showLoading({
      title: "加载中",
    })
    wx.request({
      url: `${app.URL}/operationInfo/getOperationInfoList`,
      method: "post",
      data: {
        parentID: -1,
        userName: userInfo.nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: userInfo.longitude,
        latitude: userInfo.latitude
      },
      header: {"content-type": "application/x-www-form-urlencoded"},
      success: res => {
        if (res.data.code == 0) {
          return false
        }
        res.data.data.forEach(item => {
          item.distance = this.GetDistance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), item.latitude, item.longitude);
        })
        setTimeout(() =>{
          wx.hideLoading();
          this.setData({
            list: res.data.data
          })
        }, 1000)
      }
    })
  },

  // 方法定义 lat,lng 
  GetDistance(lat1, lng1, lat2, lng2){
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },

  // 搜索关键字
  searchKeyWord(e) {
    const value = e.detail.value;
    // 符合关键字搜索的列表
    let acceptList = [];
    acceptList = this.data.list.filter(item => {
      if (item.infoName.indexOf(value) != -1) {
        return item
      }
    })
    if (value) {
      this.setData({
        list: acceptList
      })
    } else {
      this.getList()
    }
  },
  

  // 点击列表发送经纬度

  // 保存经纬度
  saveLngLat(e) {
    console.log(wx.getStorageSync("openID").data)
    const lng = e.currentTarget.dataset.longitude;
    const lat = e.currentTarget.dataset.latitude;
    wx.request({
      url: `${app.URL}/login/saveitude`,
      method: "post",
      data: {
        userID: 1,
        userName: 1,
        openID: wx.getStorageSync("openID").data,
        longitude: lng,
        latitude: lat
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: res => {
        if (res.data.code == 1) {
          wx.navigateTo({
            url: "/pages/qdhAudio/qdhAudio",
          })
        }
      }
    })
  },
  getLngLat(e) {
    wx.request({
      url: `${app.URL}/login/getItude`,
      method: "post",
      data: {
        userID: 1,
        userName: 1,
        openID: wx.getStorageSync("openID").data,
        longitude: 1,
        latitude: 1
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: res => { console.log(res.data) }
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