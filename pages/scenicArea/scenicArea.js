//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    tabList: [],  //景点分类
    scenicList: [],  //景点列表
    searchValue: ""
  },

  //改变选项卡时候
  handleChange: function (e) {
    this.setData({
      current: e.detail.key
    })
    // 点击选项卡请求不同的详情
    this.scenicArea(e.detail.key, this.data.searchValue);
  },

  // 跳转到景点介绍
  turnScenicSpot({ currentTarget }) {
    const data = currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${data.id}&name=${data.name}`
    })
  },
  /**
   * 这是分类请求成功后的函数
   * @params res 请求成功后所有的数据
   */
  successFunction(res) {
    if (res.code == 1) {
      this.setData({
        tabList: res.data
      })
    }
  },
  /**
   * 这是排列详情请求成功后的函数
   * @params res 这是成功后所有的数据
   */
  sucFun(res) {
    if (res.code == 1) {
      this.setData({
        scenicList: res.data.list
      })
      wx.hideLoading()      
    } else {
      this.setData({
        scenicList: []
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求所有的数据
    const url = `${app.URL}/viewSpot/spotParent`;
    const params = {
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFunction);

    this.scenicArea(1, "");
  },
  /**
   * 这个函数是点击分类请求景区的
   * @params id 点击不同的id来获取不同分类底下的数据
   */
  scenicArea(id, name) {
    wx.showLoading({
      title: "加载中",
    })
    const url = `${app.URL}/viewSpot/getSpotChildren`;
    const params = {
      spotParentID: id,
      name: name,
      pageNo: 1,
      pageSize: 100,
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.sucFun);
  },

  // 点击搜索
  turnToSearch() {
    // type==4
    wx.navigateTo({
      url: "/pages/searchPage/searchPage?type=4",
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