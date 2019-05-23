const app = getApp()

// pages/information/information.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            openID: wx.getStorageSync('openID').data
        },  //  用户信息
        tabs: {
            current: 1,
            tabList: []
        },
        notice: {
            list: []
        },  //  旅游资讯列表
        page: {
            pageSize: 6,
            pageNo: 1
        },   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getFirst()
    },

    /**切换分类 */
    handleChange(e) {
        const current = 'tabs.current';
        this.setData({
            [current]: e.detail.key
        })
        const pageNo = 'page.pageNo';
        const noticelist = 'notice.list';
        this.setData({
            [pageNo]: 1,
            [noticelist]: 0
        })
        this.getNoticeList(e.detail.key)
    },

    /**获取旅游资讯分类 */
    getNoticeParent() {
        // 获取资讯分类的url
        const url = `${app.URL}/notice/noticeType`;
        // 发送请求
        const promise = app.request(url, 'post');
        promise.then(res => {
            if (res.resultCode != 1) {
                app.showError('获取资讯分类失败');
                return false
            }
            const tabList = 'tabs.tabList';
            this.setData({
                [tabList]: res.module
            })
            return res.module
        }).catch(() => {
            app.showError('获取资讯分类失败')
        })
        return promise
    },

    /**获取资讯列表 */
    getNoticeList(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        // 获取资讯列表的url
        const url = `${app.URL}/notice/getNoticeList`;
        // 获取列表
        app.request(url, 'post', { recordType: id }).then(res => {
            wx.hideLoading();
            if (res.resultCode != 1) {
                app.showError('已经到底了');
                return false
            }
            const noticeList = 'notice.list';
            if (res.module.length != 0) {
                this.setData({
                    [noticeList]: res.module
                })
            } else {
                this.setData({
                    [noticeList]: []
                })
            }
        }).catch(() => {
            wx.hideLoading();
            app.showError('获取列表失败')
        })
    },

    /**第一次进入获取分类第一个 */
    getFirst() {
        this.getNoticeParent().then(res => {
            this.getNoticeList(res.module[0].id)
        })
    },

    /**跳转到资讯详情 */
    jumpToDetail({ currentTarget }) {
        wx.navigateTo({
            url: `/pages/informationDetail/informationDetail?id=${currentTarget.dataset.id}&type=${currentTarget.dataset.type}`,
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
        // const pageNo = 'page.pageNo';
        // this.setData({
        //     [pageNo]: this.data.page.pageNo += 1
        // })
        // this.getNoticeList(this.data.tabs.current)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})