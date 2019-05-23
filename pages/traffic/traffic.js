const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: []  //存放数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllTraffic()
    },

    /**
     * 获取交通所有分类
     */
    getAllTraffic() {
        wx.showLoading({
            title: "加载中",
        })
        const url = `${app.URL}/traffic`;
        const params = {
        userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        app.request(url,'post',params).then(res => {
        if (res.code === 1) {
            this.setData({
                data: res.data
            })
            wx.hideLoading()
        }
        }).catch(err => {
            app.showError('获取交通详情失败')
        })
    },

    // 跳转到详情页
    turnToDetail(e) {
        const link = e.currentTarget.dataset.link;  //自定义属性
        wx.navigateTo({
            url: `/pages/trafficDetail/trafficDetail?link=${link}`,
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