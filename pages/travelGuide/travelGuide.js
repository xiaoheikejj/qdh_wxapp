//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        user: {
            openID: ''
        },
        travel: {
            list: []
        },   //  攻略游记列表
        page: {
            pageSize: 5,
            pageNo: 1
        }   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 给openID赋值
        const userOpenID = 'user.openID';
        this.setData({
            [userOpenID]: wx.getStorageSync('openID').data
        })
    },

    /**获取游记攻略列表 */
    getTravelList() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        // 获取游记的地址
        const url = `${app.URL}/Summary/strategy`;
        // 获取游记攻略参数 -1 是全部
        const params = {
            openID: this.data.user.openID,
            type: -1
        };
        // Object.assign(params, this.data.page)
        // 发送请求
        app.request(url, 'post', params).then(res => {
            wx.hideLoading();
            if (res.resultCode != 1) {
                app.showError('获取攻略游记失败');
                return false
            }
            const travelList = 'travel.list';
            this.setData({
                [travelList]: res.module
            })
        }).catch(() => {
            app.showError('获取攻略游记失败');
            wx.hideLoading()
        })
    },

    /**跳转到详情 */
    jumpToDetail ({ currentTarget }) {
        const currentData = currentTarget.dataset;
        // 等到添加观看人数执行完后再跳转
        this.viewRequest(currentData.id).then(() => {
            wx.navigateTo({
                url: `/pages/travelGuideDetail/travelGuideDetail?id=${currentData.id}&isLike=${currentData.islike}`,
            })
        })
    },

    /**添加观看人数 */
    viewRequest(id) {
        // 发送给后台已点赞
        const url = `${app.URL}/strategy/view`;
        const params = {
            id: id,
            status: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        return app.request(url, 'post', params)
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
        // 获取游记列表
        this.getTravelList()
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
        // const pageNo = 'page.pageNo';
        // this.setData({
        //     [pageNo]: this.data.page.pageNo += 1
        // })
        // this.getTravelList()
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