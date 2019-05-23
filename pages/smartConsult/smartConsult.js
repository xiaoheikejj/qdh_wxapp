// pages/smartConsult/smartConsult.js
const app = getApp()
import { default as formatTime } from '../../utils/handleTime'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mineImgUrl: '',
        user: {
            openID: '', // 用户身份证
            message: '',  // 默认是在线咨询
            messageType: 1, // 1是投诉，2是咨询
            messageDate: ''
        },  // 储存用户发送信息
        listArray: {
            module: []
        }, // 保存用户聊天信息
        consultID: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userOpenID = 'user.openID';
        // 动态设置当前页面的标题
        wx.setNavigationBarTitle({
            title: options.name
        })
        // options.id 是 string，+ 强制转化成number
        const messageType = 'user.messageType';
        this.setData({
            mineImgUrl: wx.getStorageSync('userInfo').avatarUrl,
            [messageType]: +options.id,
            [userOpenID]: wx.getStorageSync('openID').data
        })
    },

    /**获取投诉/建议的列表 */
    getChatList(openID) {
        // 获取投诉/建议的url
        const url = `${app.URL}/suggestion/getListByUser`;
        app.request(url, 'post', {openID: openID, pageSize: 10000}).then(res => {
            if (res.resultCode == 1) {
                // 遍历筛选出投诉还是咨询
                const classifyArr = res.module.filter(function(item) {
                    return item.messageType == this.data.user.messageType
                }.bind(this))
                const module = 'listArray.module';
                this.setData({
                    [module]: classifyArr
                })
            } else {
                // app.showError('信息获取失败');
            }
        }).catch(err => {
            // app.showError('信息获取失败');
        })
    },

    /**添加消息 */
    addRequest(user) {
        const messageDate = 'user.messageDate';
        this.setData({
            [messageDate]: formatTime(new Date())
        })
        const url = `${app.URL}/suggestion/add`;
        return app.request(url, 'post', user);
    },

    /**点击完成按钮时 */
    inputConfrim(e) {
        const message = 'user.message';
        this.setData({
            [message]: e.detail.value
        })
    },

    /**实时更新信息 */
    importMsg(e) {
        const message = 'user.message';
        this.setData({
            [message]: e.detail.value
        })
    },

    /**发送信息 */
    sendMsg() {
        // 如果搜索框为空 停止下面的操作
        if (!this.data.user.message) {
            app.showError('请准确填写需要咨询/投诉的信息');
            return false;
        }
        // 发起添加请求后发起列表请求
        this.addRequest(this.data.user).then(res => {
            if (res.resultCode == 1) {
                const message = 'user.message';
                //清空输入框
                this.setData({
                    [message]: ''
                })
                return Promise.resolve();
            }
        }).then(res => {
            this.getChatList(this.data.user.openID);
            return Promise.resolve();
        }).catch(err => {
            app.showError(err)
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
        this.getChatList(this.data.user.openID);
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