// pages/searchPage/searchPage.js
const app = new getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,  //  业务类型
        list: [],
        tab: {
            list: [{
                typeID: 1,
                typeName: '景点'
            }, {
                typeID: 2,
                typeName: '文体展馆'
            }, {
                typeID: 3,
                typeName: '度假酒店'
            }, {
                typeID: 4,
                typeName: '精品民宿'
            }, {
                typeID: 5,
                typeName: '美食'
            }],
            current: 0
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // current tab
        const tabcurrent = 'tab.current';
        this.setData({
            type: options.type,
            [tabcurrent]: options.type
        })
    },

    /**分类切换 */
    handleChange: function (e) {
        const tabcurrent = 'tab.current';
        this.setData({
            [tabcurrent]: e.detail.key,
            type: e.detail.key
        })
        // 切换分类后列表清空
        this.setData({
            list: []
        })
    },

    /**键盘输入 */
    seek(e) {
        // 输入的值实时在变化，将输入的值作为title参数
        const title = e.detail.value;
        this.searchReq(this.data.type, title)
    },

    /**搜索请求 */
    searchReq(type, title) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const lnglat = {
            longitude: wx.getStorageSync('longitude'),
            latitude: wx.getStorageSync('latitude')
        };  //  用户当前经纬度
        // url
        const url = `${app.URL}/search/normal`
        // 参数
        const params = {};
        Object.assign(params, { type: type, title: title }, lnglat);
        app.request(url, 'post', params).then(res => {
            wx.hideLoading();
            if (res.resultCode != 1) {
                this.setData({
                    list: []
                })
                return false
            }
            this.setData({
                list: res.module
            })
        }).catch(() => {
            wx.hideLoading();
        })
    },

    /**跳转到详情 */
    jumpToDetail(e) {
        switch (this.data.type) {
            // 景点
            case '1':
                wx.navigateTo({
                    url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${e.currentTarget.dataset.id}`,
                })
                break;
            // 文体
            case '2':
                wx.navigateTo({
                    url: `/pages/museumPar/museumPar?id=${e.currentTarget.dataset.id}`,
                })
                break;
            // 酒店
            case '3':
                wx.navigateTo({
                    url: `/pages/hotelDetail/hotelDetail?id=${e.currentTarget.dataset.id}`,
                })
                break;
            // 民宿
            case '4':
                wx.navigateTo({
                    url: `/pages/legendDetail/legendDetail?id=${e.currentTarget.dataset.id}`,
                })
                break;
            // 美食
            case '5':
                wx.navigateTo({
                    url: `/pages/foodDetail/foodDetail?id=${e.currentTarget.dataset.id}`,
                })
                break;
        }
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