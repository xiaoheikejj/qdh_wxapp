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
        weatherTem: ""
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
                let d = new Date();
                const arrA = [], arrB = [];
                res.data.data[0].hours.forEach(item => {
                    let today = item.day.split("日")[0];
                    d.getDate() == today ? arrA.push(item) : arrB.push(item)
                });
                if (arrA.length !== 0) {
                    let currentHours = arrA.filter(item => {
                        if (d.getHours() <= Number(item.day.split("日")[1].split("时")[0])) {
                            return item
                        }
                    })
                    console.log(currentHours)
                    this.setData({
                        weatherTem: currentHours[0].tem
                    })
                }

                const data = res.data.data[0];
                // 处理day中的（）
                res.data.data.forEach((item, index, arr) => {
                    item.day = item.day.split("日")[0] + "日";
                    arr[1].tomorrow = 1;
                    if (index > 0) {
                        const weatherSituation = item.wea;
                        switch (weatherSituation) {
                            case '晴':
                                item.tomorrowImg = "../../images/index-qin.png"
                                break;
                            case '阴':
                                item.tomorrowImg = "../../images/index-yin.png"
                                break;
                            case '多云':
                                item.tomorrowImg = "../../images/index-duoyun.png"
                                break;
                            case '雨夹雪':
                                item.tomorrowImg = "../../images/index-yujiaxue.png"
                                break;
                            case '小雨':
                                item.tomorrowImg = "../../images/index-xiaoyu.png"
                                break;
                            case '中雨':
                                item.tomorrowImg = "../../images/index-zhongyu.png"
                                break;
                            case '大雨':
                                item.tomorrowImg = "../../images/index-dayu.png"
                                break;
                            case '暴雨':
                                item.tomorrowImg = "../../images/index-dayu.png"
                                break;
                            case '阵雨':
                                item.tomorrowImg = "../../images/index-leizhenyu.png"
                                break;
                            case '雷阵雨':
                                item.tomorrowImg = "../../images/index-leizhenyu.png"
                                break;
                            case '小雪':
                                item.tomorrowImg = "../../images/index-xiaoxue.png"
                                break;
                            case '阵雪':
                                item.tomorrowImg = "../../images/index-xiaoxue.png"
                                break;
                            case '中雪':
                                item.tomorrowImg = "../../images/index-zhongxue.png"
                                break;
                            case '大雪':
                                item.tomorrowImg = "../../images/index-daxue.png"
                                break;
                            case '暴雪':
                                item.tomorrowImg = "../../images/index-daxue.png"
                                break;
                            case '雾':
                                item.tomorrowImg = "../../images/index-wu.png"
                                break;
                            case '霾':
                                item.tomorrowImg = "../../images/index-wu.png"
                                break;
                            case '多云转晴':
                                item.tomorrowImg = "../../images/index-duoyun.png"
                                break;
                            case '晴转阴':
                                item.tomorrowImg = "../../images/index-duoyun.png"
                                break;
                            case '阴转多云':
                                item.tomorrowImg = "../../images/index-duoyun.png"
                                break;
                            default:
                                item.tomorrowImg = "../../images/index-yin.png"
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

                // 当天的天气
                const weatherSituation = res.data.data[0].wea;
                switch (weatherSituation) {
                    case '晴':
                        this.setData({
                            weatherImg: "../../images/index-qin.png"
                        })
                        break;
                    case '阴':
                        this.setData({
                            weatherImg: "../../images/index-yin.png"
                        })
                        break;
                    case '多云':
                        this.setData({
                            weatherImg: "../../images/index-duoyun.png"
                        })
                        break;
                    case '雨夹雪':
                        this.setData({
                            weatherImg: "../../images/index-yujiaxue.png"
                        })
                        break;
                    case '小雨':
                        this.setData({
                            weatherImg: "../../images/index-xiaoyu.png"
                        })
                        break;
                    case '中雨':
                        this.setData({
                            weatherImg: "../../images/index-zhongyu.png"
                        })
                        break;
                    case '大雨':
                        this.setData({
                            weatherImg: "../../images/index-dayu.png"
                        })
                        break;
                    case '暴雨':
                        this.setData({
                            weatherImg: "../../images/index-dayu.png"
                        })
                        break;
                    case '阵雨':
                        this.setData({
                            weatherImg: "../../images/index-leizhenyu.png"
                        })
                        break;
                    case '雷阵雨':
                        this.setData({
                            weatherImg: "../../images/index-leizhenyu.png"
                        })
                        break;
                    case '小雪':
                        this.setData({
                            weatherImg: "../../images/index-xiaoxue.png"
                        })
                        break;
                    case '阵雪':
                        this.setData({
                            weatherImg: "../../images/index-xiaoxue.png"
                        })
                        break;
                    case '中雪':
                        this.setData({
                            weatherImg: "../../images/index-zhongxue.png"
                        })
                        break;
                    case '大雪':
                        this.setData({
                            weatherImg: "../../images/index-daxue.png"
                        })
                        break;
                    case '暴雪':
                        this.setData({
                            weatherImg: "../../images/index-daxue.png"
                        })
                        break;
                    case '雾':
                        this.setData({
                            weatherImg: "../../images/index-wu.png"
                        })
                        break;
                    case '霾':
                        this.setData({
                            weatherImg: "../../images/index-wu.png"
                        })
                        break;
                    case '多云转晴':
                        this.setData({
                            weatherImg: "../../images/index-duoyun.png"
                        })
                        break;
                    case '晴转阴':
                        this.setData({
                            weatherImg: "../../images/index-duoyun.png"
                        })
                        break;
                    case '阴转多云':
                        this.setData({
                            weatherImg: "../../images/index-duoyun.png"
                        })
                        break;
                    default:
                        this.setData({
                            weatherImg: "../../images/index-yin.png"
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

    /**天气背景图 */
    requestBg() {
        const url = `${app.URL}/weather`;
        app.request(url, 'post').then(res => {
            this.setData({
                weather_bg: res.data.imgUrl
            })
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
        return {
            title: "千岛湖小程序",
            path: "/pages/leader/leader"
        }
    }
})