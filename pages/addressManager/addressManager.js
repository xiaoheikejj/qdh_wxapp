// pages/addressManager/addressManager.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        selectID: -1    // 点击后的ID
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 新增地址
     */
    addAddress() {
        wx.navigateTo({
            url: "/pages/personInfo/personInfo",
        })
    },
    
    /**
     * 获取微信地址
     */
    getWechatAddress() {
        let userName, postalCode, detailInfo, telNumber;
        wx.chooseAddress({
            success: res => {
                userName = res.userName;
                postalCode = res.nationalCode;
                detailInfo = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                telNumber = res.telNumber;
                // 发送收获地址
                this.setAddress(userName, telNumber, postalCode, detailInfo)
            }
        })
    },
    
    /**
     * 发送地址
     * @params [name] 姓名 [mobile] 电话 [code] [address] 地址
     */
    setAddress(name, mobile, code, address) {
        const url = `${app.URL}/address/addAddress`;
        const params = {
            openID: wx.getStorageSync("openID").data,
            userName: name,
            userMobile: mobile,
            userPostCode: code,
            userAddress: address,
            status: 0
        };
        app.request(url, 'post', params).then(res => {
        // 跳转到个人中心
            this.getAddress();
        }).catch(err => {
            app.showError(err);
        })
    },

    // 修改
    edit({ currentTarget }) {
        const [id, status] = [currentTarget.dataset.id, currentTarget.dataset.status];
        wx.navigateTo({
            url: `/pages/changeAddressManager/changeAddressManager?id=${id}&status=${status}`,
        })
    },

    /**
     * 获取收货列表
     */
    getAddress() {
        const url = `${app.URL}/address/getAddressList`;
        const params = {
            userID: 1,
            userName: wx.getStorageSync("userInfo").nickName,
            openID: wx.getStorageSync("openID").data,
            longitude: wx.getStorageSync("longitude"),
            latitude: wx.getStorageSync("latitude")
        };
        app.request(url, 'post', params).then(res => {
            if (res.code === 0) {
                app.showError('获取收货地址失败');
                return false;
            }
            // 遍历res.data 找出status 为 1的ID 赋值给selectID
            for(let item of res.data) {
                if (item.status === 1) {
                    this.setData({
                        list: res.data,
                        selectID: item.id
                    })
                }
            }
            // 收货地址
            wx.setStorageSync('addressList', res.data)
        }).catch(err => {
            app.showError('获取收货地址失败');
        })
    },

    /**
     * 默认收货地址
     */
    defaultSelect({ currentTarget }) {
        // 显示切换成功
        app.saluteHint('切换成功');
        const id = currentTarget.dataset.id,
            url = `${app.URL}/address/setAddressStatus`;
        // 1. 如果selectID 和 id相同，说明是重复点击，
        // 2. 重复点击 请求就不执行
        if (this.data.selectID === id) {
            return false;
        } else {
        // 3. 不是重复点击的话就就赋值给selectID
            this.setData({
                selectID: id
            })
        }
        const params = {
            id: id,
            openID: wx.getStorageSync("openID").data,
            status: 1
        };
        app.request(url, 'post', params).then(res => {
            if (res.code === 0) {
                return false
            }
            this.getAddress()
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
        this.getAddress()
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
            title: '千岛湖小程序',
            path: '/pages/leader/leader'
        }
    }
})