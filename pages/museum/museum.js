const app = getApp()

// pages/museum/museum.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: {
            current: 1,
            list: []
        },  // 分类
        museum: {
            list: []
        },   // 文体场馆
        page: {
            pageSize: 8,
            pageNo: 1
        },   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 默认渲染全部
        this.firstEnter()
    },

    /**跳转到手绘地图 */
    tohanddrawnMap() {
        wx.navigateTo({
            url: '/pages/qdhzhoubian/qdhzhoubian?typeID=2'
        })
    },

    /**tab发生改变时触发 */
    handleChange({ detail }) {
        const current = 'tab.current';
        this.setData({
            [current]: detail.key
        })
        const museumList = 'museum.list';
        // 默认列表第一页
        const pageNo = 'page.pageNo';
        this.setData({
            [museumList]: [],
            [pageNo]: 1
        })
        // 请求列表
        this.getMuseumList(detail.key);
    },

    /**获取文体场馆的分类 */
    getParent() {
        // 获取分类url
        const url = `${app.URL}/base/travelType`;
        // 获取分类请求 type = 2 代表文体
        const promise = app.request(url, 'post', { type: 2 });
        promise.then(res => {
            if (res.resultCode != 1) {
                app.showError('获取分类失败');
                return false
            }
            // res.module手动添加一个全部的分类,id是-1,放到第一位
            res.module.unshift({ typeID: -1, typeName: '全部' });
            const tabList = 'tab.list';
            // 默认tab current 是 tabList第一位
            const current = 'tab.current';
            this.setData({
                [tabList]: res.module,
                [current]: res.module[0].typeID
            })
        }).catch(() => {
            app.showError('获取分类失败')
        })
        return promise
    },

    /**获取文体场馆的列表 */
    getMuseumList(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        // 获取文体场馆url
        const url = `${app.URL}/culture/list`;
        const params = {};
        // 获取文体场馆的参数
        Object.assign(params, { typeID: id }, this.data.page);
        // 请求文体场馆
        app.request(url, 'post', params).then(res => {
            wx.hideLoading();
            const museumList = 'museum.list';
            // 保存之前的酒店列表
            const premuseumList = this.data.museum.list;
            // 如果请求的数组为空，下面代码不执行
            if (res.module) {
                premuseumList.push(...res.module);
            }
            if (res.resultCode != 1) {
                app.showError('文体列表为空');
                this.setData({
                    [museumList]: []
                })
                return false
            }
            this.setData({
                [museumList]: premuseumList
            })
        }).catch(() => {
            wx.hideLoading();
            app.showError('文体列表为空');
        })
    },

    /**第一次进入时默认渲染全部分类 */
    firstEnter() {
        new Promise((resolve, reject) => {
            resolve(this.getParent())
        }).then(res => {
            this.getMuseumList(res.module[0].typeID)
        })
    },

    /**跳转到搜索页 */
    jumpToSearch() {
        // type = 2是文体
        wx.navigateTo({
            url: '/pages/searchPage/searchPage?type=2',
        })
    },

    /**跳转到场馆详情 */
    jumpToInfo({ currentTarget }) {
        wx.navigateTo({
            url: `/pages/museumPar/museumPar?id=${currentTarget.dataset.id}`
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
        const pageNo = 'page.pageNo';
        this.setData({
            [pageNo]: this.data.page.pageNo += 1
        })
        this.getMuseumList(this.data.tab.current)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})