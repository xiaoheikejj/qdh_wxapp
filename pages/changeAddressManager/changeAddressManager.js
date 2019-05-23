// pages/personInfo/personInfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
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
    //获取userMessage
    const userMessage = wx.getStorageSync("addressList");
    const matchAddress = userMessage.filter(item => {
      if (item.id == options.id) {
        return item
      }
    })
    this.setData({
      id: options.id,
      name: matchAddress[0].userName,
      phone: matchAddress[0].userMobile,
      IDcode: matchAddress[0].userPostCode,
      address: matchAddress[0].userAddress,
      status: options.status
    })
  },
  // input失去焦点后的值
  getDetail(e) {
    // 唯一标识
    let id = e.currentTarget.dataset.id;
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
  
  /**
   * 保存个人信息
   */
  saveMessage() {
    let url = `${app.URL}/address/updateAddress`,
      params = {
        id: this.data.id,
        openID: wx.getStorageSync("openID").data,
        userName: this.data.name,
        userMobile: this.data.phone,
        userPostCode: this.data.IDcode,
        userAddress: this.data.address,
        status: this.data.status
      };
    app.request(url, 'post', params).then(res => {
      // 跳转到个人中心
      if (res.code == 1) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    }).catch(err => {
      app.showError(err)
    })
  },

  // 删除个人信息
  deleteMessage() {
    // 显示模态对话框
    wx.showModal({
      title: "提示",
      content: "您是否删除当前收货地址",
      success: res => {
        if (res.confirm) {
          this.deleteRequest()
        } else if(res.cancel) {
          setTimeout(() => {
            // 取消删除返回上一页
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    })
  },

  // 删除请求
  deleteRequest() {
    let url = `${app.URL}/address/deleteAddress`,
      params = {
        id: this.data.id,
        openID: wx.getStorageSync("openID").data
      };
    app.request(url, 'post', params).then(res => {
      // 跳转到个人中心
      if (res.code == 1) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    }).catch(err => {
      app.showError(err)
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
    return {
      title: "千岛湖小程序",
      path: "/pages/leader/leader"
    }
  }
})