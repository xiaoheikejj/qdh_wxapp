//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        backgroundImg: '',  //背景图
        firstSeason: [],  //春夏季节
        secondSeason: []  //秋冬季节
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const url = `${app.URL}/aroundview`;
        const params = {
            userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        // 获取季节
        app.request(url, 'post', params).then(res => {
        if (res.code === 1) {
            const season = res.data;
            this.setData({
                backgroundImg: res.data[0].backImgUrl,
                firstSeason: res.data.slice(0, 2),
                secondSeason: res.data.slice(2, 4)
            })
        }
        }).catch(err => {
            app.showError('获取失败')
        })
    },

    /**跳转到 */
    fullViewToFun(e) {
        const seasonUrl = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: `/pages/fullViewDetail/fullViewDetail?url=${seasonUrl}`
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
        return {
            title: "千岛湖小程序",
            path: "/pages/leader/leader"
        }
    }
})