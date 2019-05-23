//获取应用实例
const app = getApp()

Page({
    data: {
        logoURL: "",
        hotList: [],
        recommend: [],  //推荐的广告
        weatherData: "",
        temperature: "",
        weatherDesc: "",
        showMore: false, //更多的显示、不显示
        menuList: [], //这个数组用来存放和操作
        menuListArr: [],  //这个数组用来显示
        userInfo: {},
        hasUserInfo: false,
        weatherTem: "",
        weatherImg: "",
        swiper: {
            index: 0
        },
        notice: {
            list: []
        },   // 推荐列表
        page: {
            pageSize: 5,
            pageNo: 1
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        //这里是获取所有数据   
        this.getMainInfo();
        const menuList_slice = this.data.menuList.length > 10 ? this.data.menuList.slice(0, 10) : this.data.menuList;
        this.setData({
            menuListArr: menuList_slice
        });

        // 获取热门推荐
        this.getHotRecommedFun();
    },

    /**获取小程序首页信息 */
    getMainInfo() {
        wx.showLoading({
            title: '加载中',
        })
        // url
        const url = `${app.URL}/homePage/index`;
        // 参数
        const params = {
            userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        app.request(url, 'post', params).then(res => {
            if (res.code === 1) {
                this.setData({
                    logoURL: res.data.info.logo,
                    indicatorDots: !this.data.indicatorDots,
                    menuList: res.data.pageMenuList,
                    recommend: res.data.sliderList,
                })
                //让menuList变成10个
                //用slice方法在不改变原来数组的基础之上变成10个
                if (this.data.menuList.length === 0) {
                    return false;
                }
                if (this.data.menuList.length > 10) {
                    this.setData({
                        menuListArr: this.data.menuList.slice(0, 10)
                    });
                }
                wx.hideLoading()
            }
        }).catch(err => {
            app.showError('获取信息失败')
        })
    },

    /**获取热门推荐函数 */
    getHotRecommedFun() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const url = `${app.URL}/index/recommend/list`;
        app.request(url, 'post', this.data.page).then(res => {
            wx.hideLoading();
            if (res.resultCode != 1) {
                app.showError('已经到底了');
                return false
            }
            const preRecommendList = this.data.hotList;
            if (res.module.length !== 0) {
                preRecommendList.push(...res.module)
            } else {
                app.showError('已经到底了')
            }
            this.setData({
                hotList: preRecommendList
            })
        }).catch(() => {
            wx.hideLoading();
            app.showError('获取热门推荐列表失败');
        })
    },

    /**轮播图current改变触发 */
    swiperChange(e) {
        // 轮播图变化时当前current
        const current = e.detail.current;
        const swiperIndex = 'swiper.index';
        this.setData({
            [swiperIndex]: current
        })
    },

    /**点击更多的时候添加全部的menulist */
    addMore() {
        if (this.data.menuListArr.length === 10) {
            this.setData({
                showMore: true,
                menuListArr: this.data.menuList
            })
        } else {
            this.setData({
                showMore: false,
                menuListArr: this.data.menuList.slice(0, 10)
            })
        }
    },

    /**跳转到资讯页 */
    jumpToNotice() {
        wx.navigateTo({
            url: '/pages/information/information',
        })
    },

    /**获取通知公告 */
    getNoticeList() {
        const url = `${app.URL}/notice/getNoticeList`;
        // recordType=-1获取全部的咨询列表
        app.request(url, 'post', { recordType: -1 }).then(res => {
            if (res.resultCode != 1) {
                app.showError('获取通知公告失败')
                return false;
            }
            const noticeList = 'notice.list';
            this.setData({
                [noticeList]: res.module
            })
        }).catch(err => {
            app.showError('获取通知公告失败')
        })
    },

    /**调到景点 */
    turnSpot() {
        // type=1是景点
        wx.navigateTo({
            url: '/pages/searchPage/searchPage?type=1',
        })
    },

    /**热门推荐跳转 */
    turnToDetail({ currentTarget }) {
        const dataset = currentTarget.dataset;
        const [type, id] = [dataset.type, dataset.id];
        switch (type) {
            case 1:
                wx.navigateTo({
                    url: `/pages/scenicDetail/scenicDetail?id=${id}`,
                })
                break;
            case 2:
                wx.navigateTo({
                    url: `/pages/museumPar/museumPar?id=${id}`,
                })
                break;
            case 3:
                wx.navigateTo({
                    url: `/pages/hotelDetail/hotelDetail?id=${id}`,
                })
                break;
            case 4:
                wx.navigateTo({
                    url: `/pages/legendDetail/legendDetail?id=${id}`,
                })
                break;
            case 5:
                wx.navigateTo({
                    url: `/pages/foodDetail/foodDetail?id=${id}`,
                })
                break;
        }
    },
    
    /**点击menuList跳转到概述，景点介绍。。。 */
    linkJump: function (e) {
        const dataset = e.currentTarget.dataset;
        const activeArr = this.data.menuList.find(item => {
            // dataset的属性都是小写
            if (item.orderNo === dataset.orderno) {
                return item;
            }
        })
        // 如果menuUrl是概述，就用wx.switchTab，如果是其他的就用navigateTo
        if (activeArr.menuUrl == '/pages/overview/overview') {
            wx.switchTab({
                url: activeArr.menuUrl
            })
        } else {
            // 跳转到具体页面
            wx.navigateTo({
                url: activeArr.menuUrl,
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
                let d = new Date();
                const arrA = [], arrB = [];
                data.data[0].hours.forEach(item => {
                    let today = item.day.split("日")[0];
                    d.getDate() == today ? arrA.push(item) : arrB.push(item)
                });
                if (arrA.length !== 0) {
                    let currentHours = arrA.filter(item => {
                        if (d.getHours() <= Number(item.day.split("日")[1].split("时")[0])) {
                            return item
                        }
                    })
                    this.setData({
                        weatherTem: currentHours[0].tem
                    })
                }
                // 天气状况
                const weatherSituation = data.data[0].wea;
                switch (weatherSituation) {
                    case '晴':
                        this.setData({
                            weatherImg: "../../images/index-qin_white.png"
                        })
                        break;
                    case '阴':
                        this.setData({
                            weatherImg: "../../images/index-yin_white.png"
                        })
                        break;
                    case '多云':
                        this.setData({
                            weatherImg: "../../images/index-duoyun_white.png"
                        })
                        break;
                    case '雨夹雪':
                        this.setData({
                            weatherImg: "../../images/index-yujiaxue_white.png"
                        })
                        break;
                    case '小雨':
                        this.setData({
                            weatherImg: "../../images/index-xiaoyu_white.png"
                        })
                        break;
                    case '中雨':
                        this.setData({
                            weatherImg: "../../images/index-zhongyu_white.png"
                        })
                        break;
                    case '大雨':
                        this.setData({
                            weatherImg: "../../images/index-dayu_white.png"
                        })
                        break;
                    case '暴雨':
                        this.setData({
                            weatherImg: "../../images/index-dayu_white.png"
                        })
                        break;
                    case '阵雨':
                        this.setData({
                            weatherImg: "../../images/index-leizhenyu_white.png"
                        })
                        break;
                    case '雷阵雨':
                        this.setData({
                            weatherImg: "../../images/index-leizhenyu_white.png"
                        })
                        break;
                    case '小雪':
                        this.setData({
                            weatherImg: "../../images/index-xiaoxue_white.png"
                        })
                        break;
                    case '阵雪':
                        this.setData({
                            weatherImg: "../../images/index-xiaoxue_white.png"
                        })
                        break;
                    case '中雪':
                        this.setData({
                            weatherImg: "../../images/index-zhongxue_white.png"
                        })
                        break;
                    case '大雪':
                        this.setData({
                            weatherImg: "../../images/index-daxue_white.png"
                        })
                        break;
                    case '暴雪':
                        this.setData({
                            weatherImg: "../../images/index-daxue_white.png"
                        })
                        break;
                    case '雾':
                        this.setData({
                            weatherImg: "../../images/index-wu_white.png"
                        })
                        break;
                    case '霾':
                        this.setData({
                            weatherImg: "../../images/index-wu_white.png"
                        })
                        break;
                    case '多云转晴':
                        this.setData({
                            weatherImg: "../../images/index-duoyun_white.png"
                        })
                        break;
                    case '晴转阴':
                        this.setData({
                            weatherImg: "../../images/index-duoyun_white.png"
                        })
                        break;
                    case '阴转多云':
                        this.setData({
                            weatherImg: "../../images/index-duoyun_white.png"
                        })
                        break;
                    default:
                        this.setData({
                            weatherImg: "../../images/index-yin_white.png"
                        })
                }
            }
        })
    },

    /**跳转到天气详情 */
    turnWea() {
        wx.navigateTo({
            url: "/pages/weatherForecast/weatherForecast",
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取通知公告
        this.getNoticeList();
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
        const pageNo = 'page.pageNo';
        this.setData({
            [pageNo]: this.data.page.pageNo += 1
        })
        this.getHotRecommedFun()
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
