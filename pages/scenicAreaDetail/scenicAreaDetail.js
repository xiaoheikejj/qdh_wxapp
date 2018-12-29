//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sliderType: 0,
    sliderSRC: "",  // 图片/视频的链接
    introImgList: [], //轮播图的集合
    scenicName: "", //景点名字
    scenicVIewLevel: "", //景点等级
    scenicAudioTitle: "", //语音地图导览
    scenicAudioImgUrl: "",  //语音地图
    audioSRC: "", //语音地址
    audioPoster: "",  //语音海报
    audioInfoName: "",  //语音名字
    duration: "00:00",
    currentTime: "00:00",
    sliderVal: 0,
    sliderDis: false,
    audio_length: "",
    pauseOrPlay: "../../images/zt.png",
    hotSpotList: [],  //热门景点
    scenicTicketName: "", //购票说明
    scenicTicketTitle: "", // 购票标题
    scenicTicketDesc: "", //购票描述
    scenicTicketImgUrl: "", //购票图片链接
    scenicDesc: "", //文字简介
    scenicHotView: "", //热门景点推荐
    scenicViewTime: "",  //最佳旅行时间
    scenicViewRes: "",  //必备物品
    tourism: [],  //旅游列表
    like_list: [],
    like_status: 0,
    options_id: 0,
    swiperItem_active: "",
    longitude: "119.013795",
    latitude: "29.59384",
    zoom_scroll: false,
    markers: [
      {
        iconPath: "../../images/beauty_spot.png",
        id: 0,
        longitude: 119.013795,
        latitude: 29.59384,
        width: "52rpx",
        height: "60rpx"
      }
    ],
    tickets_list: [],
    label_x: false,
    scroll_y: true,
    poster_show: false,
    lng: 0,
    lat: 0,
  },
  //点击swiper图轮播的时候改变
  getVideoResource({ currentTarget }) {
    const itemID = currentTarget.dataset.id;
    this.setData({
      swiperItem_active: itemID
    })
    // [] 这种情况下面的代码就不执行
    if (this.data.introImgList.length == 0) {
      return false
    }
    // forEach循环匹配当前点击的id
    this.data.introImgList.forEach(item => {
      if (item.id == itemID) {
        this.setData({
          // 点击当前视频/图片的链接
          sliderSRC: item.sliderViewUrl,
          //点击当前图片/视频
          sliderType: item.sliderType
        })
      }
    })
  },
  /**
   * 保存请求成功后所有数据的函数
   * @params res 请求成功后所有数据
   */
  successFuntion(res) {
    if (res.code == 1) {
      const data = res.data;
      // 对游记攻略做处理
      data.info.strategy.forEach(item => {
        item.imageSRC = "../../images/ax.png"
      })
      data.info.strategy.forEach((item) => {
        // 添加标签
        if (item.strategyType == 1) {
          item.strategyTypeName = "攻略游记"
        } else if (item.strategyType == 2) {
          item.strategyTypeName = "视频"
        }
        item.gmtCreate = item.gmtCreate.split(" ")[0];        
        item.timeStamp = Math.ceil((new Date().getTime() - new Date(item.gmtCreate).getTime()) / 60 / 60 / 24 / 1000)
      })

      // 将已经点过赞的储存
      this.setData({
        like_list: res.data.like
      })
      // 判断是否已经点过赞了
      const like = data.like;
      const list = data.info.strategy;
      // 攻略游记不为空
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
      // 存储购票信息
      wx.setStorageSync("childTicketInfo", data.info.childTicketInfo);

      this.setData({
        introImgList: data.info.childSlider,
        scenicName: data.info.childName,
        scenicVIewLevel: data.info.childVIewLevel,
        scenicAudioTitle: data.info.viewAudioTitle,
        scenicAudioImgUrl: data.info.viewAudioImgUrl,
        hotSpotList: data.info.hotSpot,
        scenicTicketName: data.info.childTicketName,
        scenicTicketTitle: data.info.childTicketTitle,
        scenicTicketDesc: data.info.childTicketDesc,
        scenicTicketImgUrl: data.info.childTicketImgUrl,
        scenicDesc: data.info.childDesc,
        scenicHotView: data.info.childHotView,
        scenicViewTime: data.info.childViewTime,
        scenicViewRes: data.info.childViewRes,
        audioPoster: data.info.childAudioImgUrl,
        audioInfoName: data.info.childAudioName,
        tourism: data.info.strategy,
        tickets_list: data.info.ticket,
        lng: data.info.longitude,
        lat: data.info.latitude
      })

      if (data.info.childSlider.length != 0) {
        this.drawCanvas(data.info.childSlider[0].sliderInfoUrl, data.info.childName, data.info.childDesc);
      }

      // 第一次进去显示第一个
      if (this.data.introImgList.length != 0) {
        this.setData({
          sliderSRC: this.data.introImgList[0].sliderViewUrl,
          sliderType: this.data.introImgList[0].sliderType,
          swiperItem_active: this.data.introImgList[0].id
        })
      }

      // 音频的地址
      innerAudioContext.src = data.info.childAudioUrl;
      wx.hideLoading();
    }
  },

  //监听滑块滑动
  listenerSlider(e) {
    const per = e.detail.value / 100;
    const long = per * this.data.audio_length;
    this.setData({
      currentTime: this.formatDate(long)
    })
    innerAudioContext.seek(long);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // 经纬度
    wx.showLoading({
      title: "加载中",
    })
    // 改变title
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.requestList(options.id);
    this.setData({
      options_id: options.id
    })
  },

  requestList(id) {
    // 请求获取景区概况
    const url = `${app.URL}/viewSpot/spotChildrenInfo`;
    const params = {
      spotChildID: id,
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFuntion)
  },
  //点击跳转到详情页
  turnSpot({ currentTarget }) {
    //调用navigateTo API跳转到详情页
    wx.navigateTo({
      url: `/pages/scenicAreaSpot/scenicAreaSpot?id=${currentTarget.dataset.id}&name=${currentTarget.dataset.name}`
    });
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
    this.data.tourism.forEach(item => {
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
          header: { "content-type": "application/x-www-form-urlencoded"},
          success: res => {
            if (res.data.code == 1) {
              wx.showLoading({
                title: "加载中",
              })
              this.requestList(this.data.options_id)
            }
          }
        })
      }
    })
    this.setData({
      tourism: this.data.tourism
    })
  },

  // 跳转到购票说明
  turnToBuyTickets() {
    wx.navigateTo({
      url: "/pages/buyTicketsIntro/buyTicketsIntro",
    })
  },

  //播放和暂停
  pauseButton() {
    if (innerAudioContext.paused) {
      innerAudioContext.play();
      this.setData({
        sliderDis: false,
        pauseOrPlay: "../../images/bf.png"
      })

      setTimeout(() => {
        innerAudioContext.currentTime;
        //必须先执行onPlay方法，才能继续执行onTimeUpdate方法
        innerAudioContext.onTimeUpdate(() => {
          this.setData({
            duration: this.formatDate(innerAudioContext.duration),
            currentTime: this.formatDate(innerAudioContext.currentTime),
            audio_length: innerAudioContext.duration
          })

          const per = (innerAudioContext.currentTime / innerAudioContext.duration) * 100; 
          //获取当前播放时间所对应的slider位置
          this.setData({
            sliderVal: per,//设置slider滑块所在位置
          })
        })
      }, 500)
    } else {
      innerAudioContext.pause();
      this.setData({
        sliderDis: true,
        pauseOrPlay: "../../images/zt.png"
      })
    }

  },

  formatDate(date) {
    if (date > 60) {
      return this.formatNumber(parseInt(date / 60)) + ":" + this.formatNumber(parseInt(date % 60))
    } else {
      return "00:" + this.formatNumber(parseInt(date))
    }
  },
  // 前面添加0
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  // 跳转到语音导览
  turnToAudio() {
    wx.navigateTo({
      url: "/pages/qdhAudio/qdhAudio",
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 播放结束
    innerAudioContext.onEnded(() => {
      this.setData({
        currentTime: "00:00",
        sliderVal: 0,
        pauseOrPlay: "../../images/zt.png"
      })
    })
  },


  // 跳转到详情
  turnToDetail({ currentTarget }) {
    // 攻略图文的时候就跳转，视频不跳转
    if (currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: `/pages/travelGuideDetail/travelGuideDetail?id=${currentTarget.dataset.id}`,
      })
    }
  },

  // 打开地图
  openMap() {
    wx.openLocation({
      latitude: +this.data.lng,
      longitude: +this.data.lat,
      name: this.data.scenicName,
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
    innerAudioContext.stop()  //退出页面后停止播放
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
        ctx.drawImage("../../images/code.jpg", 38 * rpx, 310 * rpx, 40 * rpx, 40 * rpx)
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
      },
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
})