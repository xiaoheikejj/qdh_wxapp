const app = getApp()

// pages/videoVisit/videoVisit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {
            openID: ''
        },  // 用户信息
        video: {
            list: [],
            url: ''
        },   // 视频列表
        tag: {
            list: [],
            preID: 0,  // 上一次点击的ID
            id: -1 // 默认是-1
        },   // 标签列表
        showFullScreen: false,   // 关闭显示全屏显示按钮
        page: {
            pageSize: 100,
            pageNo: 1
        }   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userOpenID = 'user.openID';
        this.setData({
            [userOpenID]: wx.getStorageSync('openID').data
        })
        // 获取标签
        this.getTags();
    },

    /**获取分类标签 */
    getTags() {
        // 获取标签url
        const url = `${app.URL}/base/tags`;
        // 请求 bizType = 6 是跟着视频游
        app.request(url, 'post', { bizType: 6 }).then(res => {
            if (res.resultCode != 1) {
                app.showError('获取标签失败');
                return false
            }
            const tags = 'tag.list';
            // 初始化标签都是未选中，添加select属性为false
            for (let item of res.module) {
                item.select = false
            }
            this.setData({
                [tags]: res.module
            })
        }).catch(() => {
            app.showError('获取标签失败')
        })
    },

    /**点击标签 */
    clickTag({ currentTarget }) {
        // 点击后被点击项的id和select状态获取
        const currentData = currentTarget.dataset;
        const preTagID = 'tag.preID';
        const tags = 'tag.list';
        const tagID = 'tag.id';
        // 用一个变量接收data里面的taglist,不管是this.data.tag.list还是changeArr都是指向同一个对象
        const changeArr = this.data.tag.list;
        // 数组和被点击项进行匹配，匹配成功select状态如果原来是true的变成false，本来是false的变成true
        if (currentData.id == this.data.tag.preID) {
            this.setData({
                [tagID]: -1
            })
            // select选择状态都是false
            this.data.tag.list.forEach(function (item) {
                item.select = false
            })
        } else {
            // 赋值给tag.id
            this.setData({
                [tagID]: currentData.id
            })
            for (let item of changeArr) {
                if (item.tagID === currentData.id) {
                    item.select = true;
                } else {
                    item.select = false
                }
            }
        }
        // 赋值给tag.id
        this.setData({
            [preTagID]: currentData.id
        })
        // 赋值
        this.setData({
            [tags]: changeArr
        })
        // 点击标签后让之前的列表为空
        const emptyList = 'video.list';
        // 页数重置为1
        const pageNo = 'page.pageNo';
        this.setData({
            [pageNo]: 1,
            [emptyList]: []
        })
        // 查询列表
        this.getVideoList()
    },

    /**获取视频列表 */
    getVideoList() {
        wx.showLoading({
            title: '加载中',
        })
        // 获取视频url
        const url = `${app.URL}/video/list`;
        // 获取视频参数
        const params = {
            tagID: this.data.tag.id,
            openID: this.data.user.openID
        };
        Object.assign(params, this.page);
        // 发送请求
        app.request(url, 'post', params).then(res => {
            wx.hideLoading();
            if(res.resultCode != 1) {
                app.showError('获取视频列表失败');
                return false
            }
            // 存放之前的列表
            if (res.module) {
                res.module.forEach(function(item) {
                    item.publishDate = item.publishDate.split('.0')[0]
                })
            } else {
                app.showError('没有更多视频了');
            }
            const videoList = 'video.list';
            this.setData({
                [videoList]: res.module
            })
        }).catch(() => {
            wx.hideLoading();
            app.showError('获取视频列表失败');
            const videoList = 'video.list';
            this.setData({
                [videoList]: []
            })
        })
    },

    /**点击收藏 */
    salute(e) {
        // 储存数据的对象
        const dataset = e.currentTarget.dataset;
        // 点赞或未点赞的状态
        let activeStatus;
        if (dataset.islike == 0) {
            app.saluteHint('点赞成功');
            activeStatus = 1;
        } else {
            app.saluteHint('已经取消点赞');
            activeStatus = 0;
        };
        const url = `${app.URL}/video/like`;
        const params = {
            videoID: dataset.id,
            type: activeStatus,
            openID: this.data.user.openID
        };
        // 发送请求
        app.request(url, 'post', params).then(res => {
            if (res.resultCode != 1) {
                return false
            }
            this.getVideoList();
        })
    },

    /**播放视屏 */
    play(e) {
        const videoUrl = 'video.url';
        this.setData({
            [videoUrl]: e.currentTarget.dataset.src
        })
        console.log(e.currentTarget.dataset.src)
        // 视频的id
        const videoContext = wx.createVideoContext('videoControl');
        //执行全屏方法 
        videoContext.play();
        videoContext.requestFullScreen({ direction: 0 });
        // 观看人数
        this.watchVideo(e.currentTarget.dataset.id)
    },

    /**视频模式改变 */
    screenChange(e) {
        // 视频的id
        const videoContext = wx.createVideoContext('videoControl');
        const fullScreen = e.detail.fullScreen;
        console.log(e.detail.fullScreen)
        // 执行退出全屏方法 
        if (!fullScreen) {
            videoContext.pause();
            // 刷新
            this.getVideoList()
        }
    },

    /**观看视频后增加观看人数 */
    watchVideo(id) {
        // 增加观看人数url
        const url = `${app.URL}/video/addViews`;
        // 发送请求
        app.request(url, 'post', { newsID: id })
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
        // 获取视频列表
        this.getVideoList()
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