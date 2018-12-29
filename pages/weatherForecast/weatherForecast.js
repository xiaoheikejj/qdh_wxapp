const app = new getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather_bg: "",
    week: "",
    date: "",
    air_level: "",
    index_level: "",
    dateNature: "上午",
    dateTime: "0",
    tem2: "",
    tem1: "",
    wea: "",
    win: "",
    win_speed: "",
    feature_list: [],
    weatherImg: "",
    tomorrowImg: "",
    active_x: false,
    weatherInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getModel();
    this.requestBg();
    this.requestWea();
    const date = new Date();
    if (date.getHours() > 12) {
      this.setData({
        dateNature: "下午",
        dateTime: this.formatNumber(date.getHours()) + ": " + this.formatNumber(date.getMinutes())
      })
    } else {
      this.setData({
        dateTime: this.formatNumber(date.getHours()) + ": " + this.formatNumber(date.getMinutes())
      })
    }
  },
  
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  // 获取手机型号
  getModel() {
    wx.getSystemInfo({
      success: res => {
        const model = res.model.split("iPhone ")[1];
        if (model == "X") {
          this.setData({
            active_x: true
          })
        }
      }
    })
  },
  // 请求天气
  requestWea() {
    //获取天气
    wx.request({
      url: "https://www.tianqiapi.com/api/",
      method: "get",
      data: {
        "version": "v1",
        "city": "淳安"
      },
      success: res => {
        // 当前时间
        let currentTime = new Date();
        let currentTime_array = res.data.data[0].hours.filter(item => {
          if (currentTime.getDate() == item.day.split("日")[0]) {
            return item
          }
        });
        this.setData({
          weatherInfo: currentTime_array[0]
        })

        const data = res.data.data[0];
        // 处理day中的（）
        res.data.data.forEach((item, index, arr) => {
          item.day = item.day.split("日")[0] + "日";
          arr[1].tomorrow = 1;
          if (index > 0) {
            const weatherSituation = item.wea;
            if (weatherSituation == "晴") {
              item.tomorrowImg = "../../images/qin.png"
            } else if (weatherSituation == "阴") {
              item.tomorrowImg ="../../images/yin.png"
            } else if (weatherSituation == "多云") {
              item.tomorrowImg = "../../images/duoyun.png"
            } else if (weatherSituation == "雨夹雪") {
              item.tomorrowImg = "../../images/yujiaxue.png"
            } else if (weatherSituation == "小雨") {
              item.tomorrowImg = "../../images/xiaoyu.png"
            } else if (weatherSituation == "中雨") {
              item.tomorrowImg = "../../images/zhongyu.png"
            } else if (weatherSituation == "大雨" || weatherSituation == "暴雨") {
              item.tomorrowImg = "../../images/dayu.png"
            } else if (weatherSituation == "阵雨" || weatherSituation == "雷阵雨") {
              item.tomorrowImg = "../../images/leizhenyu.png"
            } else if (weatherSituation == "小雪" || weatherSituation == "阵雪") {
              item.tomorrowImg = "../../images/xiaoxue.png"
            } else if (weatherSituation == "中雪") {
              item.tomorrowImg = "../../images/zhongxue.png"
            } else if (weatherSituation == "大雪" || weatherSituation == "暴雪") {
              item.tomorrowImg = "../../images/daxue.png"
            } else if (weatherSituation == "雾" || weatherSituation == "霾") {
              item.tomorrowImg = "../../images/wu.png"
            } else if (weatherSituation == "多云转晴" || weatherSituation == "晴转阴" || weatherSituation == "阴转多云") {
              item.tomorrowImg = "../../images/duoyunzhuanzhenyu.png"
            } else {
              item.tomorrowImg = "../../images/yin.png"
            }
          }
        })

        data.week = data.week.split("星期")[1];
        this.setData({
          air_level: data.air_level,
          index_level: data.index[0].level,
          week: `周${data.week}`,
          date: data.date,
          tem2: data.tem2,
          tem1: data.tem1,
          wea: data.wea,
          win: data.win[0],
          win_speed: data.win_speed,
          feature_list: res.data.data.slice(1, 6)
        })

        const weatherSituation = res.data.data[0].wea;
        if (weatherSituation == "晴") {
          this.setData({
            weatherImg: "../../images/qin.png"
          })
        } else if (weatherSituation == "阴") {
          this.setData({
            weatherImg: "../../images/yin.png"
          })
        } else if (weatherSituation == "多云") {
          this.setData({
            weatherImg: "../../images/duoyun.png"
          })
        } else if (weatherSituation == "雨夹雪") {
          this.setData({
            weatherImg: "../../images/yujiaxue.png"
          })
        } else if (weatherSituation == "小雨") {
          this.setData({
            weatherImg: "../../images/xiaoyu.png"
          })
        } else if (weatherSituation == "中雨") {
          this.setData({
            weatherImg: "../../images/zhongyu.png"
          })
        } else if (weatherSituation == "大雨" || weatherSituation == "暴雨") {
          this.setData({
            weatherImg: "../../images/dayu.png"
          })
        } else if (weatherSituation == "阵雨" || weatherSituation == "雷阵雨") {
          this.setData({
            weatherImg: "../../images/leizhenyu.png"
          })
        } else if (weatherSituation == "小雪" || weatherSituation == "阵雪") {
          this.setData({
            weatherImg: "../../images/xiaoxue.png"
          })
        } else if (weatherSituation == "中雪") {
          this.setData({
            weatherImg: "../../images/zhongxue.png"
          })
        } else if (weatherSituation == "大雪" || weatherSituation == "暴雪") {
          this.setData({
            weatherImg: "../../images/daxue.png"
          })
        } else if (weatherSituation == "雾" || weatherSituation == "霾") {
          this.setData({
            weatherImg: "../../images/wu.png"
          })
        } else if (weatherSituation == "多云转晴" || weatherSituation == "晴转阴" || weatherSituation == "阴转多云") {
          this.setData({
            weatherImg: "../../images/duoyunzhuanzhenyu.png"
          })
        } else {
          this.setData({
            weatherImg: "../../images/yin.png"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  requestBg() {
    wx.request({
      url: app.URL + "/weather",
      method: "post",
      header: { "content-type": "application/x-www-form-urlencoded" },
      success: res => {
        this.setData({
          weather_bg: res.data.data.imgUrl
        })
      }
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