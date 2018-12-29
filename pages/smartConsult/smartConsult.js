// pages/smartConsult/smartConsult.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    askList: [],
    mineImgUrl: "",
    inputText: "",
    button_active: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mineImgUrl: wx.getStorageSync("userInfo").avatarUrl
    })

    this.setWatcher(this.data, this.watch)
  },

  //数据监听
  watch: {
    inputVal: function(newValue) {
      
    }
  },
  //键盘输入时
  importMsg(e) {
    const value = e.detail.value;
    // 输入的值不为空的时候，按钮高亮
    if (!value) {
      this.setData({
        button_active: false
      })
    } else {
      this.setData({
        button_active: true
      })
    }
    this.setData({
      inputVal: value
    })
  },
  //完成按钮时
  inputConfrim(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  // 发送信息
  sendMsg() {
    // 如果搜索框为空 return
    if (!this.data.inputVal) {
      return false
    }
    // 发送按钮变灰色
    this.setData({
      button_active: false
    })
    
    const length = this.data.askList.length;
    this.data.askList[length] = { text: this.data.inputVal,me: 1 };
    this.setData({
      askList: this.data.askList
    })

    this.requestList();
    //清空输入框
    this.setData({
      inputText: "",
      inputVal: ""
    })
  },

  // 请求所有
  requestList() {
    wx.request({
      url: app.URL + "/qa",
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        condition: this.data.inputVal
      },
      success: res => {
        var length = this.data.askList.length;
        this.data.askList[length] = { text: "我为你罗列了以下常见问题，希望能帮助到您", me: 2, list: res.data.data };
        this.setData({
          askList: this.data.askList
        })
      }
    })
  },
  // 跳转链接
  turnToLink({currentTarget}) {
    // 跳转内部的页面
    wx.navigateTo({
      url: currentTarget.dataset.link
    })
  },



  // 设置监听器
  setWatcher(data, watch) {
    Object.keys(watch).forEach(v => {
      this.observe(data, v, watch[v])
    })
  },
  // 监听属性
  observe(obj, key, watchFun) {
    var val = obj[key];
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        val = value;
        watchFun(value, val)
      },
      get: function() {
        return val
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