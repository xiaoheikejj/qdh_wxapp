// pages/consult/consult.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        supportList: [],
        type: {
            list: [{
                name: '在线投诉',
                value: 1
            }, {
                name: '在线咨询',
                value: 2
            }]
        },   //  投诉类型还是咨询类型
        index: 0  // index 的值表示选择了 range 中的第几个（下标从 0 开始）
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSupport()
    },

    /**获取基本信息 */
    getSupport() {
        // 获取基本信息的地址
        const url = `${app.URL}/support`;
        // 参数
        const params = {
            userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        app.request(url, 'post', params).then(res => {
            this.setData({
                supportList: res.data
            })
        }).catch(err => {
            app.showError('获取基本信息失败')
        })
    },

    /**跳转链接获取拨打电话咨询 */
    consult({ currentTarget }) {
        const dataset = currentTarget.dataset;
        if (dataset.type != 1) {
            wx.makePhoneCall({
                phoneNumber: dataset.desc
            })
        }
    },

    /**选择投诉还是咨询 */
    bindPickerChange(e) {
        // range 中的第几个. e.detail.value是个string，+将string转为number，如果string中不是数字，将是NaN
        const index = +e.detail.value;
        if (Number.isNaN(index)) {
            app.showError('选择错误');
            return false
        }
        wx.navigateTo({
            url: `/pages/smartConsult/smartConsult?id=${this.data.type.list[index].value}&name=${this.data.type.list[index].name}`,
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