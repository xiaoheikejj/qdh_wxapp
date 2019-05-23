// pages/travelGuideDetail/travelGuideDetail.js
const app = new getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        strategy: {
            result: {},
            id: 0,
            isLike: -1 // 是否被点赞
        },  //  攻略详情
        user: {
            openID: wx.getStorageSync('openID').data
        },  //  用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 保存攻略的ID
        const strategyID = 'strategy.id';
        // 当前详情是否被点赞
        const isLike = 'strategy.isLike';
        this.setData({
            [strategyID]: options.id,
            [isLike]: options.isLike
        })
    },

    /**获取游记详细信息 */
    getTravelDetail(id, isLike) {
        // 攻略详情地址
        const url = `${app.URL}/strategy/strategyInfo`;
        // 攻略详情参数
        const params = {
            id: id,
            userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        app.request(url, 'post', params).then(res => {
            const strategyResult = 'strategy.result';
            if (res.code != 1) {
                app.showError('获取攻略详情失败');
                return false
            }
            const strategyInfo = res.data.strategyInfo;

            // //重点是这句话 进行正则匹配的 改变图片的宽度和高度
            res.data.strategyInfo = strategyInfo.replace(/style="padding: 15px; list-style-type: none;"/gi, 'style="width:100%;height:auto"')

            res.data.strategyInfo = strategyInfo.replace(/style="padding-top: 15px; padding-bottom: 15px; list-style-type: none;"/gi, 'style="width:100%;height:auto"')
            // 去除日期后面.0
            res.data.gmtCreate = res.data.gmtCreate.split('.0')[0];
            // 当前详情是否被点赞
            res.data.isLike = isLike;
            this.setData({
                [strategyResult]: res.data
            })
        }).catch(() => {
            app.showError('获取攻略详情失败')
        })
    },

    /**点赞获取取消点赞 */
    setLike() {
        // 获取详情的状态 isLike = 1 是已点赞 = 0 是未点赞
        const status = this.data.strategy.result.isLike;
        // 请求的url
        const url = `${app.URL}/strategy/like`
        // 参数
        const params = {
            id: this.data.strategy.id,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        const isLike = 'strategy.isLike';
        if (status == 1) {
            Object.assign(params, { status: 0 });
            this.setData({
                [isLike]: 0
            })
            app.saluteHint('已取消点赞')
        } else {
            Object.assign(params, { status: 1 });
            this.setData({
                [isLike]: 1
            })
            app.saluteHint('点赞成功')
        }
        app.request(url, 'post', params).then(res => {
            this.getTravelDetail(this.data.strategy.id, this.data.strategy.isLike);
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
        this.getTravelDetail(this.data.strategy.id, this.data.strategy.isLike);
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