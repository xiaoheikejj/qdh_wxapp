//获取应用实例
const app = getApp()
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');

Page({
  data: {
    iconShow: true, //头部搜素图标
    logoURL: "",
    hotList: [],
    indicatorDots: false, //轮播图下面的小点点
    recommend: [],  //推荐的广告
    weatherData: "",
    temperature: "",
    weatherDesc: "",
    showMore: "../../images/more_2013.png", //更多的显示、不显示
    menuList: [], //这个数组用来存放和操作
    menuListArr: [],  //这个数组用来显示
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weatherInfo: [],
    weatherImg: ""
  },
  /**
   * 这是成功的函数
   * @param res 这是用来保存数据的
   */
  successFunction(res) {
    if (res.code == 1) {
      this.setData({
        logoURL: res.data.info.logo,
        hotList: res.data.hotList,
        indicatorDots: !this.data.indicatorDots,
        menuList: res.data.pageMenuList,
        recommend: res.data.sliderList,
      })
      wx.hideLoading()
    }
    //让menuList变成10个
    //用slice方法在不改变原来数组的基础之上变成10个
    if (this.data.menuList.length == 0) {
      return false
    }
    this.setData({
      menuListArr: this.data.menuList.slice(0, 10)
    });
  },

  onLoad: function () {
    wx.showLoading({
      title: "加载中",
    })
    //这里是获取所有数据
    const url = `${app.URL}/homePage/index`;
    const params = {
      userID: 1,
      userName: wx.getStorageSync("userInfo").nickName,
      openID: wx.getStorageSync("openID").data,
      longitude: wx.getStorageSync("longitude"),
      latitude: wx.getStorageSync("latitude")
    };
    app.request.requestApi(url, params, "post", this.successFunction);

    const menuList_slice = this.data.menuList.slice(0, 10);
    this.setData({
      menuListArr: menuList_slice
    });
  },


  //点击更多的时候添加全部的menulist
  addMore: function () {
    if (this.data.menuListArr.length == 10) {
      this.setData({
        showMore: "../../images/more_selected_2013.png",
        menuListArr: this.data.menuList
      })
    } else {
      this.setData({
        showMore: "../../images/more_2013.png",
        menuListArr: this.data.menuList.slice(0, 10)
      })
    }
  },

  // 调到景点
  turnSpot() {
    // type==4
    wx.navigateTo({
      url: "/pages/searchPage/searchPage?type=4",
    })
  },

  // 热门推荐跳转
  turnToDetail(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  // 点击menuList跳转到概述，景点介绍。。。
  linkJump: function ({ currentTarget }) {
    const dataset = currentTarget.dataset;
    if (dataset.id == 1) {
      //跳转到概述
      wx.navigateTo({
        url: "/pages/overview/overview"
      })
    } else if (dataset.id == 2) {
      //跳转到景点介绍
      wx.navigateTo({
        url: "/pages/scenicArea/scenicArea"
      })
    } else if (dataset.id == 3) {
      //跳转到全景漫游
      wx.navigateTo({
        url: "/pages/fullView/fullView"
      })
    } else if (dataset.id == 4) {
      //跳转到全景漫游
      wx.navigateTo({
        url: "/pages/qdhAudio/qdhAudio"
      })
    } else if (dataset.id == 5) {
      //跳转到游记攻略
      wx.navigateTo({
        url: "/pages/travelGuide/travelGuide"
      })
    } else if (dataset.id == 6) {
      wx.navigateTo({
        url: "/pages/traffic/traffic"
      })
    } else if (dataset.id == 7) {
      wx.navigateTo({
        url: "/pages/qdhzhoubian/qdhzhoubian"
      })
    } else if (dataset.id == 8) {
      wx.navigateTo({
        url: "/pages/food/food"
      })
    } else if (dataset.id == 9) {
      wx.navigateTo({
        url: "/pages/hotel/hotel"
      })
    } else if (dataset.id == 10) {
      wx.navigateTo({
        url: "/pages/kar/kar"
      })
    } else if (dataset.id == 11) {
      wx.navigateTo({
        url: "/pages/legend/legend"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //存放在userInfo中
    const userInfo = wx.getStorageSync("userInfo");
    
    //获取天气
    wx.request({
      url: "https://www.tianqiapi.com/api/",
      method: "get",
      data: {
        "version": "v1",
        "city": "淳安"
      },
      success: res => {
        const data = res.data;
        // 当前时间
        let currentTime = new Date();
        let currentTime_array = data.data[0].hours.filter(item => {
          if (currentTime.getDate() == item.day.split("日")[0]) {
            return item
          }
        });
        this.setData({
          weatherInfo: currentTime_array[0]
        })
        const weatherSituation = data.data[0].wea;
        if (weatherSituation == "晴") {
          this.setData({
            weatherImg: "../../images/qin_white.png"
          })
        } else if (weatherSituation == "阴") {
          this.setData({
            weatherImg: "../../images/yin_white.png"
          })
        } else if (weatherSituation == "多云") {
          this.setData({
            weatherImg: "../../images/duoyun_white.png"
          })
        } else if (weatherSituation == "雨夹雪") {
          this.setData({
            weatherImg: "../../images/yujiaxue_white.png"
          })
        } else if (weatherSituation == "小雨") {
          this.setData({
            weatherImg: "../../images/xiaoyu_white.png"
          })
        } else if (weatherSituation == "中雨") {
          this.setData({
            weatherImg: "../../images/zhongyu_white.png"
          })
        } else if (weatherSituation == "大雨" || weatherSituation == "暴雨") {
          this.setData({
            weatherImg: "../../images/dayu_white.png"
          })
        } else if (weatherSituation == "阵雨" || weatherSituation == "雷阵雨") {
          this.setData({
            weatherImg: "../../images/leizhenyu_white.png"
          })
        } else if (weatherSituation == "小雪" || weatherSituation == "阵雪") {
          this.setData({
            weatherImg: "../../images/xiaoxue_white.png"
          })
        } else if (weatherSituation == "中雪") {
          this.setData({
            weatherImg: "../../images/zhongxue_white.png"
          })
        } else if (weatherSituation == "大雪" || weatherSituation == "暴雪") {
          this.setData({
            weatherImg: "../../images/daxue_white.png"
          })
        } else if (weatherSituation == "雾" || weatherSituation == "霾") {
          this.setData({
            weatherImg: "../../images/wu_white.png"
          })
        } else if (weatherSituation == "多云转晴" || weatherSituation == "晴转阴" || weatherSituation == "阴转多云") {
          this.setData({
            weatherImg: "../../images/duoyunzhuanzhenyu_white.png"
          })
        } else {
          this.setData({
            weatherImg: "../../images/yin_white.png"
          })
        }
      }
    })
  },

  // 跳转到天气详情
  turnWea() {
    wx.navigateTo({
      url: "/pages/weatherForecast/weatherForecast",
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // const access_token = wx.getStorageSync("access_token");
    // wx.request({
    //   url: `https://api.weixin.qq.com/cgi-bin/wxaapp/getwxacode`,
    //   method: "post",
    //   data: { access_token : access_token },
    //   header: { "content-type": "application/x-www-form-urlencoded" },
    //   success: res => {
    //     console.log(res)
    //   }
    // })
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
