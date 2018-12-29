// pages/moreImg/moreImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    img_array: [],
    video_array: [],
    type_active: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取viewInfo图片和视频
    const viewInfoSliderList = wx.getStorageSync("viewInfoSliderList");
    const img_array = [],
      video_array = [];
    viewInfoSliderList.forEach(item => {
      if (item.sliderType == 0) {
        // 视频
        video_array.push(item)
      } else if (item.sliderType == 1) {
        // 图片
        img_array.push(item)
      }
    })
    this.setData({
      img_array: img_array,
      video_array: video_array,
      list: img_array
    })
  },

  // 选择图片或者视频
  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      type_active: type
    })
    if (type == 1) {
      this.setData({
        list: this.data.img_array
      })
    } else if (type == 0) {
      this.setData({
        list: this.data.video_array
      })
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

  }
})