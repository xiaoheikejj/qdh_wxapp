// pages/favorite/favorite.js
const app = getApp()
import { favoriteCancel, favoriteList } from '../../api/favorite'
import { GetDistance } from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        x: 0,
        favorite: {
            list: [{
                id: -1,
                name: '全部'
            }, {
                id: 1,
                name: '景点'
            }, {
                id: 2,
                name: '美食'
            }, {
                id: 3,
                name: '酒店'
            }, {
                id: 4,
                name: '民宿'
            }, {
                id: 5,
                name: '文体场馆'
            }],
            current: -1 //  默认是全部
        },
        result: [],
        user: {
            openID: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 给openID赋值（值保存在本地）
        const userOpenID = 'user.openID';
        this.setData({
            [userOpenID]: wx.getStorageSync('openID').data
        })
    },

    /**跳转到详情的函数 */
    toDetailFun(e) {
        const dataset = e.currentTarget.dataset;
        switch (dataset.type) {
            case 1:
                wx.navigateTo({
                    url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${dataset.id}`
                })
                break;
            case 2:
                wx.navigateTo({
                    url: `/pages/foodDetail/foodDetail?id=${dataset.id}`
                })
                break;
            case 3:
                wx.navigateTo({
                    url: `/pages/hotelDetail/hotelDetail?id=${dataset.id}`
                })
                break;
            case 4:
                wx.navigateTo({
                    url: `/pages/legendDetail/legendDetail?id=${dataset.id}`
                })
                break;
            case 5:
                wx.navigateTo({
                    url: `/pages/museumPar/museumPar?id=${dataset.id}`
                })
                break;
        }
    },

    /**获取收藏列表 */
    getFavorite(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const lnglat = {
            lng: wx.getStorageSync('longitude'),
            lat: wx.getStorageSync('latitude')
        };  //  经纬度
        // 请求的url
        const url = `${app.URL}/favorite/page`;
        favoriteList(url, this.data.user.openID, id).then(res => {
            wx.hideLoading();
            if (res.resultCode != 1) {
                // 获取失败赋予空数组
                this.setData({
                    result: []
                })
            }
            for (let item of res.module) {
                // 计算距离保留2位小数
                item.distance = GetDistance(item.latitude, item.longitude, lnglat.lat, lnglat.lng).toFixed(2)
            }
            this.setData({
                result: res.module
            })
        }).catch(() => {
            // 获取失败赋予空数组
            this.setData({
                result: []
            })
        })
    },

    /**列表切换 */
    handleChange(e) {
        const current = 'favorite.current';
        this.setData({
            [current]: e.detail.key
        });
        this.getFavorite(e.detail.key)
    },

    /**取消收藏 */
    cancelFavorite({ currentTarget }) {
        const currentData = currentTarget.dataset;
        // 取消收藏的url
        const url = `${app.URL}/favorite/cancel`;
        // 参数
        favoriteCancel(url, currentData.type, this.data.user.openID, currentData.id).then(res => {
            this.setData({
                x: 0
            })
            this.getFavorite(this.data.favorite.current)
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
        // 获取收藏列表
        this.getFavorite(this.data.favorite.current)
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