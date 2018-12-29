//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrl: [],
    index: 0,
    dataList: [],
    pageSize: 5,
    loadingShow: true
  },
  //点击饭馆跳转到详情
  turnDetail({ currentTarget }) {
    wx.navigateTo({
      url: "/pages/hotelDetail/hotelDetail?id=" + currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // banner
    wx.request({
      url: app.URL + "/banner",
      method: "post",
      data: {
        bannerType: 2,
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
    this.requestList("");
  },
  //点击完成时触发
  turnToSearch() {
    // type==1
    wx.navigateTo({
      url: "/pages/searchPage/searchPage?type=1",
    })
  },
  requestList(name) {
    wx.request({
      url: app.URL + "/hotel/hotelList",
      method: "POST",
      data: {
        pageNo: 1,
        pageSize: this.data.pageSize,
        userID: 1,
        name: name,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: {"content-type": "application/x-www-form-urlencoded"},// 设置请求的 header
      success: res => {
        const data = res.data;
        // 如果flag正确的时候开
        if (data.code == 1) {

          //loading开关
          if (data.data.list.length >= data.data.total) {
            this.setData({
              loadingShow: false
            })
          }

          this.setData({
            dataList: data.data.list
          })
        } else {
          // 请求不到的时候为空
          this.setData({
            dataList: []
          })
        }
        // 500ms后隐藏loading
        setTimeout(() => {
          wx.hideLoading();
        }, 500)
      }
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