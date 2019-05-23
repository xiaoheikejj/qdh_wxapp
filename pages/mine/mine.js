const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        collect: {
            num: 0
        },  // 收藏条数
        notice: {
            num: 0
        }, // 资讯条数
        avatarUrl: '',
        nickName: '',
        userIntegral: 0, //积分
        has_sign: false // 已签到
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userIntegral: wx.getStorageSync("userIntegral")
        })
    },

    /**点击会议打卡开启摄像头进行扫描 */
    scanCode() {
        wx.scanCode({
            success: res => {
                // 回调的结果
                const result = res.result;
                this.metPunchClock(result)
            }
        })
    },

    /**
     * 会议打卡
     * @param result mettingID
     */
    metPunchClock(result) {
        const url = `${app.URL}/meeting/userMeeting`;
        const params = {
            meetingID: result,
            userOpenID: wx.getStorageSync("openID").data,
            userName: wx.getStorageSync("userInfo").nickName,
            userHeadImgUrl: wx.getStorageSync("userInfo").avatarUrl
        };
        app.request(url, 'post', params).then(res => {
            wx.showToast({
                title: '打卡成功',
                icon: 'none',
                duration: 2000
            })
        }).catch(err => {
            app.showError('打卡失败')
        })
    },

    /**签到积分 */
    getIntegral() {
        const url = `${app.URL}/login/getIntegral`;
        const params = {
            userOpenID: wx.getStorageSync("openID").data
        };
        app.request(url, 'post', params).then(res => {
            const info = res;
            if (info.code == 0) {
                wx.showToast({
                    title: "今天已经签到过了",
                    icon: "none",
                    duration: 3000
                })
            } else if (info.code == 1) {
                this.setData({
                    userIntegral: this.data.userIntegral += 5,
                    has_sign: true
                })
                wx.showToast({
                    title: "签到成功",
                    icon: "none",
                    duration: 3000
                })
            }
        }).catch(err => {
            app.showError('签到失败')
        })
    },

    /**我的收藏条数 */
    collectNum() {
        // url
        const url = `${app.URL}/favorite/page`;
        // 参数
        const params = {
            openID: wx.getStorageSync('openID').data,
            type: -1
        };
        app.request(url, 'post', params).then(res => {
            if (res.resultCode != 1) {
                return false
            }
            const num = 'collect.num';
            this.setData({
                [num]: res.record
            })
        })
    },

    /**获取资讯条数 */
    noticeNum() {
        // url
        const url = `${app.URL}//notice/getNoticeList`;
        // 请求
        app.request(url, 'post', { recordType: -1 }).then(res => {
            if (res.resultCode != 1) {
                return false
            }
            const num = 'notice.num';
            this.setData({
                [num]: res.record
            })
        })
    },

    /**跳转到我的收藏 */
    jumpToCollect() {
        wx.navigateTo({
            url: '/pages/favorite/favorite'
        })
    },

    /**跳转到旅游资讯 */
    jumpToInformation() {
        wx.navigateTo({
            url: '/pages/information/information',
        })
    },

    /**收货地址 */
    turnToAddress() {
        wx.navigateTo({
            url: '/pages/addressManager/addressManager',
        })
    },

    goDial() {
        wx.navigateTo({
            url: "/pages/integralActivity/integralActivity?type=dial",
        })
    },

    goCard() {
        wx.navigateTo({
            url: "/pages/integralActivity/integralActivity?type=card",
        })
    },

    goTiger() {
        wx.navigateTo({
            url: "/pages/integralActivity/integralActivity?type=tiger",
        })
    },

    // 我的奖品
    turnToPrize() {
        wx.navigateTo({
            url: "/pages/myPrize/myPrize",
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
        // 收藏条数
        this.collectNum();
        // 资讯条数
        this.noticeNum();
        this.getNewIntegral()
    },

    /**获取积分 */
    getNewIntegral() {
        const userInfo = wx.getStorageSync("userInfo");
        const url = `${app.URL}/login/login`;
        const params = {
            userName: userInfo.nickName,
            userSex: userInfo.gender,
            userOpenID: wx.getStorageSync("openID").data,
            userCity: userInfo.city,
            userHeadImgUrl: userInfo.avatarUrl,
            userProvince: userInfo.province,
            userCountry: userInfo.country
        };
        app.request(url, 'post', params).then(res => {
            if (res.code === 1) {
                this.setData({
                    userIntegral: res.data.userInfo.userIntegral
                })
            }
        }).catch(err => {
            app.showError('获取积分失败')
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
        return {
            title: "千岛湖小程序",
            path: "/pages/leader/leader"
        }
    }
})