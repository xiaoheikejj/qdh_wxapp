//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerImgUrl: [],
    dataList: [],
    pickerArray: [
      {
        name: "全部",
        id: ""
      }, {
        name: "游记视频",
        id: 2
      }, {
        name: "游记攻略",
        id: 1
      }
    ],
    pickerIndex: 0,
    loadingShow: true,
    pageSize: 5,
    clickType: "",  // 视频,攻略游记的类型
    like_list: [],
    like_status: 0
  },
  /**
   * 改变分类后触发这个函数
   */
  bindPickerChange(e) {
    this.setData({
      pickerIndex: e.detail.value
    })
  },
  /**
   * 这是分类请求成功后的函数
   * @params res 请求成功后所有的数据
   */
  successFunction(res) {
    //请求失败后面的操作就不执行
    if (res.code == 0) {
      return false
    }
    res.data.list.forEach((item) => {
      // 添加标签
      if (item.strategyType == 1) {
        item.strategyTypeName = "攻略游记"
      } else if (item.strategyType == 2) {
        item.strategyTypeName = "攻略视频"
      }
      item.gmtCreate = item.gmtCreate.split(" ")[0];
      item.timeStamp = Math.ceil(+(new Date().getTime() - new Date(item.gmtCreate).getTime()) / 60 / 60 / 24 / 1000)
    })
    //loading动画开关
    if (res.data.list.length >= res.data.total) {
      this.setData({
        loadingShow: false
      })
    }
    if (res.code == 1) {
      //把爱心图片放进去
      res.data.list.forEach(item => {
        item.imageSRC = "../../images/ax.png"
      })

      // 将已经点过赞的储存
      this.setData({
        like_list: res.data.like
      })
      // 判断是否已经点过赞了
      const like = res.data.like;
      const list = res.data.list;
      if (like && list) {
        list.forEach(item => {
          like.forEach(i => {
            if (item.id == i.strategyID) {
              if (i.status == 1) {
                item.imageSRC = "../../images/dax.png"
              }
            }
          })
        })
      }

      this.setData({
        dataList: res.data.list
      })
    }
   
    wx.hideLoading();
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
        if (res.data.code == 1) {
          const data = res.data;
          this.setData({
            bannerImgUrl: data.data
          })
        }
      }
    })
    // 开启加载动画
    wx.showLoading({
      title: "加载中",
    })
    this.requestList("")
  },

  //请求出所有列表
  requestList(type) {
    const url = app.URL + "/strategy/strategyList";
    const params = {
      pageNo: 1,
      pageSize: this.data.pageSize,
      userID: 1,
      strategyType: type,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFunction);
  },

  // 点击分类出现列表
  clickType({ currentTarget}) {
    // 加载中
    wx.showLoading({
      title: "加载中",
    })

    this.requestList(currentTarget.dataset.id);

    //clickType储存起来后续再用
    this.setData({
      clickType: currentTarget.dataset.id
    })
  },

  // 点击了喜欢按钮
  clickLike({ currentTarget }) {
    // 点赞/取消的id
    const has_give_like = currentTarget.dataset.id;
    this.data.like_list.forEach(item => {
      if (has_give_like == item.strategyID) {
        // 设置点赞or取消点赞
        if (item.status == 0) {
          this.setData({
            like_status: 1
          })
        } else {
          this.setData({
            like_status: 0
          })
        }
      }
    })
    //循环数据数组，匹配点击后获取的id
    this.data.dataList.forEach(item => {
      // 如果匹配，变成红心
      if (currentTarget.dataset.id == item.id) {
        if (this.data.like_status == 1) {
          item.imageSRC = "../../images/dax.png"
        } else {
          item.imageSRC = "../../images/ax.png"
        }
       
        // 发送给后台已点赞
        wx.request({
          url: `${app.URL}/strategy/like`,
          method: "post",
          data: {
            id: currentTarget.dataset.id,
            status: this.data.like_status,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
          },
          header: {"content-type": "application/x-www-form-urlencoded"},
          success: res => {
            if (res.data.code == 1) {
              wx.showLoading({
                title: "加载中",
              })
              this.requestList(this.data.clickType)
            }
          }
        })
    
      }
    })
    this.setData({
      dataList: this.data.dataList
    })
  },

  // 跳转到详情
  turnToDetail ({currentTarget}) {
    // 攻略图文的时候就跳转，视频不跳转
    if (currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: `/pages/travelGuideDetail/travelGuideDetail?id=${currentTarget.dataset.id}`,
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
    // 如果flag正确的时候开
    if (this.data.loadingShow) {
      wx.showLoading({
        title: "加载中",
      })
    } else {
      
    }
    this.data.pageSize += 5;
    this.requestList(this.data.clickType)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})