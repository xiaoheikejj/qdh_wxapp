// pages/travelGuideDetail/travelGuideDetail.js
const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ID: 0,
    gmtCreate: "",
    strategyImgUrl: "",
    strategyTitle: "",
    strategyLikeNumber: 0,
    strategyViewNumber: 0,
    strategyID: 0,
    like_image: "../../images/ax.png",
    like_status: 0,
    strategyInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ID: options.id
    })
    this.requestDetail(options.id);
  },
  // 取消、点赞
  clickLike() {
    wx.request({
      url: `${app.URL}/strategy/like`,
      method: "post",
      data: {
        id: this.data.strategyID,
        status: this.data.like_status,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: res => {
        if (res.data.code == 1) {
          wx.showLoading({

          })
          this.requestDetail(this.data.ID)
        }
      }
    })
  },
  // 是否是喜欢
  requestLike() {
    wx.request({
      url: `${app.URL}/strategy/strategyList`,
      method: "post",
      data: {
        pageNo: 1,
        pageSize: 100,
        userID: 1,
        strategyType: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: { "content-type": "application/x-www-form-urlencoded" },// 设置请求的 header
      success: res => {
        if (res.data.code == 0) {
          return false
        }
        const data = res.data.data.like;
        // 是否是喜欢
        let like_list = [];
        like_list = data.filter(item => {
          if (this.data.strategyID == item.strategyID) {
            return item
          }
        })
        if (like_list[0].status == 1) {
          this.setData({
            like_image: "../../images/dax.png",
            like_status: 0
          })
        } else {
          this.setData({
            like_image: "../../images/ax.png",
            like_status: 1
          })
        }
        wx.hideLoading()
      }
    })
  },
  // 详情信息
  requestDetail(ID) {
    wx.request({
      url: `${app.URL}/strategy/strategyInfo`,
      method: "post",
      data: {
        id: ID,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: { "content-type": "application/x-www-form-urlencoded" },// 设置请求的 header
      success: res => {
        if (res.data.code == 0) {
          return false
        }
        const data = res.data.data;
       
        data.gmtCreate = data.gmtCreate.split(" ")[0];
        data.gmtCreate = Math.ceil(+(new Date().getTime() - new Date(data.gmtCreate).getTime()) / 60 / 60 / 24 / 1000)
        this.setData({
          strategyTitle: data.strategyTitle,
          strategyImgUrl: data.strategyImgUrl,
          strategyLikeNumber: data.strategyLikeNumber,
          strategyViewNumber: data.strategyViewNumber,
          strategyID: data.id,
          gmtCreate: data.gmtCreate,
          strategyInfo: data.strategyInfo
        })

        this.requestLike()
      }
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