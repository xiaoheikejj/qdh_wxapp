//获取应用实例
const app = getApp()
import { getTag } from '../../api/tag'
import { GetDistance } from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotel: {
            list: [],
        },  //  酒店列表
        tag: {
            list: [],
            preID: 0,  // 上一次点击的ID
            id: -1  // 默认的tagID为-1
        },  // 标签列表
        range: {
            list: [{
                id: 1,
                name: '评价最高'
            }, {
                id: 2,
                name: '人均最高'
            }, {
                id: 3,
                name: '人均最低'
            }, {
                id: 4,
                name: '距离最近'
            }],
            index: 0
        },
        page: {
            pageSize: 8,
            pageNo: 1
        }   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取标签
        this.tags();
        // 获取酒店列表
        this.getHotel()
    },

    /**跳转到手绘地图 */
    tohanddrawnMap() {
        wx.navigateTo({
            url: '/pages/qdhzhoubian/qdhzhoubian?typeID=3'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    
    /**跳转到酒店详情 */
    jumpToInfo({ currentTarget }) {
        wx.navigateTo({
            url: `/pages/hotelDetail/hotelDetail?id=${currentTarget.dataset.id}`
        })
    },

    /**点击完成时触发 */
    turnToSearch() {
        // type=3是度假酒店
        wx.navigateTo({
            url: '/pages/searchPage/searchPage?type=3',
        })
    },

    /**获取酒店标签 */
    tags() {
        // 获取标签url
        const url = `${app.URL}/base/tags`;
        // bizType = 3 是酒店
        getTag(url, 3).then(res => {
            if (res.resultCode != 1) {
                app.showError('获取酒店标签失败');
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
        })
    },

    /**改变滚动选择器 */
    bindPickerChange({ detail }) {
        // picker的下标
        const index = 'range.index';
        this.setData({
            [index]: +detail.value
        })
        // 点击标签后让之前的列表为空
        const emptyList = 'hotel.list';
        // 页数默认是1
        const pageNo = 'page.pageNo';
        this.setData({
            [emptyList]: [],
            [pageNo]: 1
        })
        this.getHotel()
    },

    /**点击标签 */
    clickTag({ currentTarget }) {
        // 点击后被点击项的id和select状态获取
        const currentData = currentTarget.dataset;
        const preTagID = 'tag.preID';
        const tags = 'tag.list';
        const tagID = 'tag.id';
        const changeArr = this.data.tag.list;
        // 上一次和当次点击的ID相同的话，tag.id为-1,搜索全部
        if (currentData.id == this.data.tag.preID) {
            this.setData({
                [tagID]: -1                
            })
            // select选择状态都是false
            this.data.tag.list.forEach(function(item) {
                item.select = false
            })
        } else {
            this.setData({
                [tagID]: currentData.id
            })
            // 用一个变量接收data里面的taglist,不管是this.data.tag.list还是changeArr都是指向同一个对象
            // 数组和被点击项进行匹配，匹配成功select状态是true，其他的为false
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
        const emptyList = 'hotel.list';
        // 页数默认是1
        const pageNo = 'page.pageNo';
        this.setData({
            [emptyList]: [],
            [pageNo]: 1
        })
        // 查询列表
        this.getHotel()
    },

    /**获取酒店列表 */
    getHotel() {
        // 开启加载动画
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const lngLat = {
            longitude: wx.getStorageSync('longitude'),
            latidute: wx.getStorageSync('latitude')
        };
        // 获取酒店列表的URL
        const url = `${app.URL}/hotel/list`;
        // 获取openID
        const openID = wx.getStorageSync('openID').data;
        const params = {};
        Object.assign(params, lngLat, { openID: openID, orderNO: this.data.range.list[this.data.range.index].id, tagID: this.data.tag.id }, this.data.page);
        // 获取酒店列表
        app.request(url, 'post', params).then(res => {
            wx.hideLoading();
            const hotelList = 'hotel.list';
            // 保存之前的酒店列表
            const preHotelList = this.data.hotel.list;
            // 如果请求的数组为空，下面代码不执行
            if (res.module) {
                preHotelList.push(...res.module);
            }
            if (res.resultCode != 1) {
                app.showError('获取酒店列表失败');
                return false
            }
            // 距离保留2位小数，单位千米
            for (let item of res.module) {
                item.disntance = (item.disntance/1000).toFixed(2)
            }
            this.setData({
                [hotelList]: preHotelList
            })
        }).catch(() => {
            wx.hideLoading();
            app.showError('没有更多的酒店了');
        })
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
        this.getHotel()
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