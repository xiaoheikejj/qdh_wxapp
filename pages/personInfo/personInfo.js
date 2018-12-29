// pages/personInfo/personInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID: "",
    name: "",
    phone: null,
    IDcode: null,
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取userMessage
    const userMessage = wx.getStorageSync("userMessage").data;
    wx.request({
      url: app.URL + "/login/h5userInfo",
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"        
      },
      data: {
        openID: wx.getStorageSync("openID").data
      },
      success: res => {
        const result = res.data;
        const user = result.data.user;
        if (result.code == 1) {
          this.setData({
            name: user.userRealName,
            phone: user.userMobile,
            IDcode: user.userIDCode,
            address: user.userAddress,
          })
        }
      }
    })
  },
  // input失去焦点后的值
  getDetail(e) {
    // 唯一标识
    let id = e.currentTarget.id;
    // 值
    let value = e.detail.value;
    if (id == 1) {
      this.setData({
        name: value
      })
    } else if (id == 2) {
      this.setData({
        phone: value
      })
    } else if (id == 3) {
      this.setData({
        IDcode: value
      })
    } else if (id == 4) {
      this.setData({
        address: value
      })
    }
  },
  // 保存个人信息
  saveMessage() {
    wx.request({
      url: app.URL + "/login/getUserInfo",
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userOpenID: wx.getStorageSync("openID").data,
        userRealName: this.data.name,
        userMobile: this.data.phone,
        userIDCode: this.data.IDcode,
        userAddress: this.data.address
      },
      success: res => {
        // 跳转到个人中心
        if (res.data.code == 1) {
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/mine/mine"
            })
          }, 2000)
        }
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