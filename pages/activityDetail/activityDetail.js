// pages/activityDetail/activityDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityID: 0,
    name: "", //活动名字
    imageURL: "", //图片
    address: "",  //地点
    activityBeginTime: "", //活动时间
    activityEndTime: "",
    intro: "", //介绍
    label_x: false,
    scroll_y: true,
    poster_show: false,
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //活动ID
    this.setData({
      activityID: options.id
    })
    // 获取用户手机型号
    wx.getSystemInfo({
      success: res => {
        let model = res.model;
        if (model.split("iPhone ")[1] == "X") {
          this.setData({
            label_x: true
          })
        }
      }
    })
  },

  // 调到搜索页面
  turnToSearch() {
    
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
    wx.showLoading({
      title: "加载中",
    })
    wx.request({
      url: `${app.URL}/activity/activityInfo`,
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded"},
      data: {
        activityID: this.data.activityID,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      success: res => {
        if (res.data.code == 1) {
          const data = res.data.data;
          // 去除时间后面的".0"
          data.activityBeginTime = data.activityBeginTime.split(".0")[0];
          data.activityEndTime = data.activityEndTime.split(".0")[0];
          this.setData({
            imageURL: data.activityImgUrl,
            name: data.activityName,
            address: data.activityAddress,
            activityBeginTime: data.activityBeginTime,
            activityEndTime: data.activityEndTime,
            intro: data.activityDesc,
            latitude: data.latitude,
            longitude: data.longitude
          })
          wx.hideLoading();

          this.drawCanvas(this.data.imageURL, this.data.name, this.data.intro)
        }
      }
    })
  },
  // 关闭海报
  removePoseter() {
    this.setData({
      scroll_y: true,
      poster_show: false
    })
  },
  // 打开海报
  getPoster() {
    this.setData({
      poster_show: true,
      scroll_y: false
    })
  },
  // 绘制canvas
  drawCanvas(image, title, text) {
    wx.getImageInfo({
      src: image,
      success: res => {
        let rpx;
        // 获取屏幕宽度，获取自适应单位
        wx.getSystemInfo({
          success: function (res) {
            rpx = res.windowWidth / 375;
          },
        })
        const ctx = wx.createCanvasContext("myCanvas");
        // 画图
        ctx.drawImage("../../images/code.jpg",38*rpx,310*rpx,40*rpx,40*rpx)
        ctx.drawImage(res.path, 0, 0, 200 * rpx, 100 * rpx);
        ctx.setFontSize(8 * rpx);
        ctx.fillText(title, 5 * rpx, 120 * rpx);
        ctx.setFillStyle("#51a5ff");
        ctx.fillRect(0, 112 * rpx, 2 * rpx, 10 * rpx);
        ctx.setFontSize(7 * rpx);
        ctx.setFillStyle("#a2a2a2");
        ctx.fillText("长按小程序查看详情", 87 * rpx, 325 * rpx);
        ctx.fillText("分享自「千岛湖」", 87 * rpx, 340 * rpx);
        let arr = this.textByteLength(text, 55);
        if (arr[1].length > 4) {
          ctx.fillText(arr[1][0], 5 * rpx, 135 * rpx);
          ctx.fillText(arr[1][1], 5 * rpx, 145 * rpx);
          ctx.fillText(arr[1][2], 5 * rpx, 155 * rpx);
          ctx.fillText(arr[1][3], 5 * rpx, 165 * rpx);
          ctx.fillText(arr[1][4], 5 * rpx, 175 * rpx);
        }    
        ctx.draw()
      }
    })
    
  },

  textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },
  // 打开地图导航
  openMap() {
    wx.openLocation({
      latitude: +this.data.latitude,
      longitude: +this.data.longitude,
      name: this.data.name,
      address: this.data.address
    })
  },
  // 保存图片到相册
  saveImage() {
    wx.canvasToTempFilePath({
      canvasId: "myCanvas",
      fileType: "png",
      success: res =>{
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          complete: res => {
            wx.showToast({
              title: "保存成功",
            });
          }
      })
      }
    })
    
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