//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrl: [],
    participation: true, //参与活动
    dataList: [], //活动所有的数据
    pageSize: 5,
    loadingShow: true
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
        bannerType: 3,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: {"content-type": "application/x-www-form-urlencoded"},// 设置请求的 header
      success: res => {
        const data = res.data;
        if (data.code == 1) {
          this.setData({
            bannerImgUrl: data.data
          })
        }
      }
    })
    //请求列表的所有信息
    wx.showLoading({
      title: "加载中",
    })
    //获取所有数据
    this.requestList("")
  },
  requestList(pageSize) {
    //这里是获取所有数据
    const url = app.URL + "/activity/activityList";
    var params = {
      pageNo: 1,
      pageSize: this.data.pageSize,
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    wx.request({
      url: url,
      method: "post",
      header: {"content-type": "application/x-www-form-urlencoded"},
      data: params,
      success: res => {
        const data = res.data;
        data.data.list.forEach((item) => {
          let activityEndTime = item.activityEndTime.split(" ")[0];
          let date1 = new Date(activityEndTime).getTime();
          let date2 = new Date().getTime();
          if (date1 > date2) {
            item.participation = true
          } else {
            item.participation = false
          }
          //去除时分秒
          item.activityBeginTime = item.activityBeginTime.split(" ")[0];
          item.activityEndTime = item.activityEndTime.split(" ")[0];
        })
        //loading开关
        if (data.data.list.length >= data.data.total) {
          this.setData({
            loadingShow: false
          })
        }
        if (data.code == 1) {
          this.setData({
            dataList: data.data.list
          })
        }
        // 500ms后隐藏loading
        setTimeout(() => {
          wx.hideLoading();
        }, 500)
      }
    })
    // app.request.requestApi(url, params, "post", this.successFunction);
  },

  //活动
  turnToSearch() {
    wx.navigateTo({
      url: "/pages/searchPage/searchPage?type=5",
    })
  },
  //跳转到详情页
  turnToDetail({ currentTarget }) {
    wx.navigateTo({
      url: `/pages/activityDetail/activityDetail?id=${currentTarget.dataset.id}`,
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
    if (this.data.loadingShow) {
      wx.showLoading({
        title: "加载中",
      })
    } else {
      
    }
    this.data.pageSize += 5;
    this.requestList("")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})