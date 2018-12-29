const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioSRC: "", //语音地址
    audioPoster: "",  //语音海报
    audioInfoName: "",  //语音名字
    duration: "00:00",
    currentTime: "00:00",
    sliderVal: 0,
    sliderDis: false,
    audio_length: "",
    pauseOrPlay: "../../images/zt.png",
    introImgList: [], //轮播图的集合 
    currentItemId: 1, //轮播图的id
    dataList: [], //游记攻略
    infoDesc: "",  //千岛湖景区描述
    recommendList: [], //热门推荐列表
    hotRecommendShow: [],  //热门推荐显示列表
    recommendCurrentID: 0,
    hotRecClass: "", //热门推荐是否添加active
    recommendTitle: "",  // 热门推荐的标签
    video_array: [],
    address: "",
    telPhone: "",
    this_longitude: "",
    this_latitude: "",
    name: "",
    like_list: [],
    like_status: 0,
    options_id: 0,
    label_x: false,
    scroll_y: true,
    poster_show: false,
  },
  //点击swiper图轮播的时候改变

  itemChange({ currentTarget }) {
    const itemId = currentTarget.dataset.itemId;
    this.setData({
      currentItemId: itemId
    })
  },

  swiperChange({ detail }) {
    const currentItemId = detail.currentItemId;
    this.setData({
      currentItemId: currentItemId
    })
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
    wx.showLoading({
      title: "加载中",
    })
    innerAudioContext.seek(0);//设置音频初始位置为0
    // 请求获取景区概况
    wx.request({
      url: `${app.URL}/home/index`,
      method: "post",
      data: {
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
          //概述的slider集合
          wx.setStorageSync("viewInfoSliderList", data.data.info.viewInfoSliderList);
          // 筛选出所有视频,选出第一个视频作为官方推荐视频
          const video_arr = [];
          data.data.info.viewInfoSliderList.forEach(item => {
            if (item.sliderType == 0) {
              video_arr.push(item)
            }
          })
          this.setData({
            video_array: video_arr
          })

          const result = data.data.info;
          this.setData({
            // introImgList: data.data.info.viewInfoSliderList,
            infoDesc: result.infoDesc,
            audioSRC: result.infoAudioUrl,
            audioPoster: result.infoAudioImgUrl,
            audioInfoName: result.infoAudioName,
            address: result.infoAddress,
            telPhone: result.infoTel,
            this_longitude: result.longitude,
            this_latitude: result.latitude,
            name: result.infoName
          })
          // 绘制海报
          let imgList = result.viewInfoSliderList.filter(item => {
            if (item.sliderType == 1) {
              return item
            }
          })
          this.drawCanvas(imgList[0].sliderInfoUrl, "千岛湖概述", result.infoDesc);
          // 音频的地址
          innerAudioContext.src = data.data.info.infoAudioUrl;
          wx.hideLoading();      
        }
      }
    })

    this.requestGuide()
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
  // 请求游记攻略
  requestGuide() {
    wx.request({
      url: `${app.URL}/home/strategy`,
      method: "post",
      header: {"content-type": "application/x-www-form-urlencoded"},// 设置请求的 header
      data: {
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      success: res => {
        // 排除请求错误的可能性
        if (res.data.code == 0) {
          return false
        }
        const data = res.data;
        // 游记攻略点赞进行处理
        data.data.strategy.forEach(item => {
          item.imageSRC = "../../images/ax.png"
        })
        // 游记攻略时间
        data.data.strategy.forEach(item => {
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
          like_list: data.data.like
        })
        if (data.code == 1) {
          wx.hideLoading();
          // 判断是否已经点过赞了
          const like = data.data.like;
          const list = data.data.strategy;
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
            dataList: data.data.strategy
          })
        }
      }
    })
  },
  
  // 获取热门推荐
  getHotRecommend() {
    wx.request({
      url: `${app.URL}/home/spotViewList`,
      method: "post",
      header: {"content-type": "application/x-www-form-urlencoded"},
      data: {
        userID: 1,
        userName: wx.getStorageSync("userInfo").nickName,
        openID: wx.getStorageSync("openID").data,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      },
      success: res => {
        // 排除错误的可能性
        if (res.data.code == 0) {
          return false
        }
        const data = res.data;
        let id = 0;
        data.data.forEach(item => {
          id += 1;
          item.id = id;
        })
        if (data.code == 1) {
          this.setData({
            recommendList: data.data
          })
          // 热门推荐下面的列表
          this.setData({
            hotRecommendShow: this.data.recommendList[0].list,
            recommendTitle: this.data.recommendList[0].title,
            recommendCurrentID: 1
          })
        }
      }
    })
  },

  // 点击热门推荐的时候选择
  selectRecommend({currentTarget}) {
    this.setData({
      hotRecommendShow: this.data.recommendList[currentTarget.dataset.id - 1].list,
      recommendTitle: this.data.recommendList[currentTarget.dataset.id - 1].title,
      recommendCurrentID: currentTarget.dataset.id,
      // 给热门推荐添加active
      hotRecClass: currentTarget.dataset.id - 1 
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
                title: "加载中"
              })
              this.requestGuide()
            }
          }
        })
      }
    })
    this.setData({
      dataList: this.data.dataList
    })
  },

  // 更多视频/图片
  turnMoreImg() {
    wx.navigateTo({
      url: "/pages/moreImg/moreImg"
    })
  },

  // 拨打电话
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.telPhone
    })
  },

  // 打开内置地图
  openMap() {
    console.log(this.data.this_longitude)
    wx.openLocation({
      latitude: +this.data.this_longitude,
      longitude: +this.data.this_latitude,
      address: this.data.address,
      name: this.data.name
    })
  },
  // 跳转到详情
  turnToInfoDetail(e) {
    const current = e.currentTarget.dataset;
    if (current.typeid == 1) {
      wx.navigateTo({
        url: `/pages/foodDetail/foodDetail?id=${current.id}`,
      })
    } else if (current.typeid == 2) {
      wx.navigateTo({
        url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${current.id}`,
      })
    } else if (current.typeid == 3) {
      wx.navigateTo({
        url: `/pages/hotelDetail/hotelDetail?id=${current.id}`,
      })
    }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHotRecommend();
    // 播放结束
    innerAudioContext.onEnded(() => {
      this.setData({
        currentTime: "00:00",
        sliderVal: 0,
        pauseOrPlay: "../../images/zt.png"
      })
    })
  },
  //全景漫游
  turnToFullView() {
    wx.navigateTo({
      url: "/pages/fullView/fullView"
    })
  },
  //语音导览
  turnToAudio() {
    wx.navigateTo({
      url: "/pages/qdhAudio/qdhAudio"
    })
  },
  //行程打卡
  turnToKar() {
    wx.navigateTo({
      url: "/pages/kar/kar"
    })
  },
  // 游记攻略详情
  turnToDetail(e) {
    // 判断类型
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    if (type == 1) {
      wx.navigateTo({
        url: `/pages/travelGuideDetail/travelGuideDetail?id=${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
})
