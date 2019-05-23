// pages/toilet/toilet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            openID: wx.getStorageSync('openID').data
        },
        typeID: null,
        src: ''
    },

    /**
     * 生命周期函数--监听页面加载
    //  */
    onLoad: function (options) {
        // 找厕所的typeID是6
        // isAudio = 1为语音导览 0 是 非语音导览
        // 拼接maptypeID参数不能用&符号，不然在手绘地图getCode这个接口会url验证不通过
        this.setData({
            src: `https://demo.magicreal.net/qiandaohuaudio?openID=${wx.getStorageSync('openID').data}maptypeID=6mapTitle=2`
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