// pages/moreImg/moreImg.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: {
            total: [],
            img: [],
            video: []
        },
        type: {
            active: 1
        },
        showFullScreen: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getResource();
    },

    /**对图片或者视频资源分配 */
    getResource() {
        const resouce = wx.getStorageSync('viewInfoSliderList');
        const video = 'list.video';
        const img = 'list.img';
        const total = 'list.total';
        const totalVideo = [], totalImg = []
        for (let item of resouce) {
            if (item.sliderType == 0) {
                // 如果是视频加个视频名称属性
                // 加一个idValue属性, 用来让每个视频的id唯一
                item.idValue = `primaryVideo${item.id}`
                totalVideo.push(item)
            } else {
                totalImg.push(item)
            }
        }
        this.setData({
            [img]: totalImg,
            [video]: totalVideo,
            [total]: totalImg
        })
        console.log(resouce)
    },

    /**播放视屏 */
    play(e) {
        // 视频的id
        const videoContext = wx.createVideoContext(e.currentTarget.dataset.idvalue);
        console.log(e.currentTarget.dataset.idvalue)
        //执行全屏方法 
        videoContext.requestFullScreen({ direction: 0 });
    },

    /**视频模式改变 */
    screenChange(e) {
        // 视频的id
        const videoContext = wx.createVideoContext(e.currentTarget.dataset.idvalue);
        const fullScreen = e.detail.fullScreen;
        // 执行退出全屏方法 
        if (!fullScreen) {
            videoContext.pause();
        }
    },

    /**选择图片或者视频 */
    selectType(e) {
        const type = e.currentTarget.dataset.type;
        const typeactive = 'type.active';
        this.setData({
            [typeactive]: type
        })
        const total = 'list.total';
        if (type == 1) {
            this.setData({
                [total]: this.data.list.img
            })
        } else {
            this.setData({
                [total]: this.data.list.video
            })
        }
    },

    /**点击放大图片 */
    preview(e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.src],
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