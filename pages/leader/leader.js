const app = getApp()

// pages/leader/leader.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取个人地理位置
        wx.getLocation({
            success: res => {
                wx.setStorageSync("longitude", res.longitude);
                wx.setStorageSync("latitude", res.latitude);
            },
        })
    },

    /**点击获取权限按钮才会触发 */
    getUserInfo: function (e) {
        const userInfo = e.detail.userInfo;
        // 请求login
        // 1. 当openID存在的时候才请求login
        const openID = wx.getStorageSync('openID').data;
        console.log(openID)
        if (!openID) {
            app.showError('openID获取失败');
            return false
        }
        this.userInfoRe(e, userInfo);
    },

    /**
     * 登录获取用户信息
     * @param e 对象e，userinfo 用户个人信息对象
     */
    userInfoRe(e, userInfo) {
        // 加载loading动画
        wx.showLoading({
            title: '登录中',
            mask: true
        })
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
            // 取消加载动画
            wx.hideLoading();
            if (res.code === 1) {
                wx.setStorageSync("userIntegral", res.data.userInfo.userIntegral);
                wx.setStorageSync("userInfo", e.detail.userInfo);
                wx.switchTab({
                    url: '/pages/index/index'
                })
            } else {
                app.showError('登录失败')
            }
        }).catch(err => {
            // 取消加载动画
            wx.hideLoading();
            app.showError('登录失败');
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