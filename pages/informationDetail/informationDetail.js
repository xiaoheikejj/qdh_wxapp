const app = getApp()

// pages/informationDetail/informationDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            openID: wx.getStorageSync('openID').data
        },
        notice: {
            result: {},
            id: 0,
            type: 0
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = 'notice.id';
        const type = 'notice.type';
        this.setData({
            [id]: options.id,
            [type]: options.type
        })
    },

    /**获取资讯详情 */
    getNoticeDetail(id, type) {
        // 获取资讯详情的地址
        const url = `${app.URL}/notice/getNoticeList`;
        // 发送请求
        app.request(url, 'post', { recordType: type }).then(res => {
            if (res.resultCode != 1) {
                app.showError('获取资讯详情失败');
                return false
            }
            const noticeResult = 'notice.result';
            for (let item of res.module) {
                if (id == item.id) {
                    const content = item.content;
                    //重点是这句话 进行正则匹配的 改变图片的宽度和高度
                    item.content = content.replace(/style="padding: 15px; list-style-type: none;"/gi, 'style="width:100%;height:auto"')

                    item.content = content.replace(/style="padding-top: 15px; padding-bottom: 15px; list-style-type: none;"/gi, 'style="width:100%;height:auto"')
                    this.setData({
                        [noticeResult]: item
                    })
                }
            }
        }).catch(() => {
            app.showError('获取资讯详情失败')
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
        this.getNoticeDetail(this.data.notice.id, this.data.notice.type)
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