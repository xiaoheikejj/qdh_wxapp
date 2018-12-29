//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: "",  // 经度
    latitude: "", // 纬度
    scenicSpotID: 0,
    swiperList: [], //轮播图片
    name: "", //景点名字
    title: "",  //景点标题
    describe: "",  //景点描述
    address: "",  //地址
    indicatorDots: true,
    tel: ""  //电话
  },

  /**
   * 这是分类请求成功后的函数
   * @params res 请求成功后所有的数据
   */
  successFunction(res) {
    if (res.code == 1) {
      const data = res.data;
      this.setData({
        swiperList: data.slider,
        name: data.infoName,
        title: data.infoTitle,
        describe: data.infoDesc,
        address: data.infoAddress,
        tel: data.infoTel,
        longitude: data.longitude,
        latitude: data.latitude
      })
      wx.hideLoading()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
    })
    if (this.data.swiperList.length != 0) {
      this.setData({
        indicatorDots: true
      })
    }
    // 在onLoad阶段就是先获取spotID
    this.setData({
      scenicSpotID: options.id
    });
    // 标题名字
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取景点详情的详情
    var url = app.URL + "/viewSpot/spotLess";
    var params = {
      spotLessID: this.data.scenicSpotID,
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFunction);
    
  },

  // 获取地点位置
  getLocation() {
    wx.openLocation({
      longitude: +this.data.longitude,
      latitude: +this.data.latitude,
      name: this.data.name,
      address: this.data.address
    })
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.tel,
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