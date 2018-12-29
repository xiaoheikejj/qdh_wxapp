// pages/searchPage/searchPage.js
const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchType: [
      {
        type: 1,
        name: "酒店"
      }, {
        type: 2,
        name: "名宿"
      }, {
        type: 3,
        name: "美食"
      }, {
        type: 4,
        name: "景区"
      }, {
        type: 5,
        name: "活动"
      }
    ],
    lineShow: 0,
    page_size: 5,
    input_val: "",
    array_list: [],
  },

  // 选择类型
  selectType({currentTarget}) {
    const type = currentTarget.dataset.type;
    this.setData({
      lineShow: type,
      array_list: []
    })
  },

  // 自动变化input的值
  inputValue(e) {
    this.setData({
      input_val: e.detail.value
    })
  },

  //去除input值
  removeInputVal() {
    console.log(4)
    this.setData({
      input_val: ""
    })
  },
  // 点击搜索请求
  searchRequest() {
    wx.showLoading({
      title: "加载中",
    })
    if (this.data.lineShow == 4) {
      this.searchScenic(this.data.input_val)
    } else if (this.data.lineShow == 5) {
      this.searchActivety(100, this.data.input_val)
    } else {
      this.searchHotel(this.data.input_val)
    } 
  },


  // 搜索酒店
  searchHotel(name) {
    let type_name;
    if (this.data.lineShow == 1) {
      type_name = "/hotel/hotelList"
    } else if (this.data.lineShow == 2) {
      type_name = "/homeStay/hotelList"
    } else if (this.data.lineShow == 3) {
      type_name = "/cate/cateList"
    }
    wx.request({
      url: `${app.URL}${type_name}`,
      method: "post",
      data: {
        pageNo: 1,
        pageSize: this.data.page_size,
        userID: 1,
        name: name,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: { "content-type": "application/x-www-form-urlencoded" },// 设置请求的 header
      success: res => {
        const result = res.data;
        if (result.code == 0) {
          this.setData({
            array_list: []
          })
          return false
        }
        this.setData({
          array_list: result.data.list
        })
        
        wx.hideLoading()
      }
    })
  },

  // 搜索景区
  searchScenic(name) {
    wx.request({
      url: `${app.URL}/viewSpot/getSpotChildren`,
      method: "post",
      data: {
        spotParentID: 1,
        name: name,
        pageNo: 1,
        pageSize: 100,
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      header: { "content-type": "application/x-www-form-urlencoded" },// 设置请求的 header
      success: res => {
        const result = res.data;
        if (result.code == 0) {
          this.setData({
            array_list: []
          })
          return false
        }
        this.setData({
          array_list: result.data.list
        })
        wx.hideLoading()
      }
    })
  },

  // 搜索活动
  searchActivety(pageSize, name) {
    //这里是获取所有数据
    const url = `${app.URL}/activity/activityList`;
    var params = {
      name: name,
      pageNo: 1,
      pageSize: pageSize,
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    wx.request({
      url: url,
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded" },
      data: params,
      success: res => {
        if (res.data.code == 0) {
          return false
        }
        const data = res.data;
        data.data.list.forEach((item) => {
          var date1 = new Date(item.activityEndTime).getTime();
          var date2 = new Date().getTime();
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
            array_list: data.data.list
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const search_type = options.type;
    this.setData({
      lineShow: search_type
    })
  },
  // 酒店
  turnHotelDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/hotelDetail/hotelDetail?id=${id}`,
    })
  },
  // 名宿
  turnLegendDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/legendDetail/legendDetail?id=${id}`,
    })
  },
  // 饭店
  turnFoodDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/foodDetail/foodDetail?id=${id}`,
    })
  },
  // 景点详情
  turnScenicSpot(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${id}`,
    })
  },
  // 跳转活动详情页
  turnToActivityDetail(e) {
    wx.navigateTo({
      url: `/pages/activityDetail/activityDetail?id=${e.currentTarget.dataset.id}`,
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