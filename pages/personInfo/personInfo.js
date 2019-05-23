// pages/personInfo/personInfo.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openID: "",
    name: "",
    phone: "",
    IDcode: "",
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },
  // input失去焦点后的值
  getDetail(e) {
    // 唯一标识
    const id = e.currentTarget.dataset.id;
    // 值
    const value = e.detail.value;
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
  
  /**
   * 保存个人信息
   */
  saveMessage() {
    if (this.data.name && this.data.phone && this.data.IDcode && this.data.address) {
      let url = `${app.URL}/address/addAddress`,
        params = {
          openID: wx.getStorageSync("openID").data,
          userName: this.data.name,
          userMobile: this.data.phone,
          userPostCode: this.data.IDcode,
          userAddress: this.data.address,
          status: 0
        };
      app.request(url, 'post', params).then(res => {
        // 跳转到个人中心
        if (res.code === 1) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    } else {
      wx.showToast({
        title: "请填写完整",
        icon: "none"
      })
      return false
    }
    
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
    return {
      title: "千岛湖小程序",
      path: "/pages/leader/leader"
    }
  }
})