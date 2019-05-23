//获取应用实例
const app = getApp()
import { GetDistance } from '../../utils/util'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        params: {
            openID: wx.getStorageSync("openID").data
        },  //请求的参数
        tab: {
            list: [],
            current: -1
        },  // 分类
        scenic: {
            arealist: [],
            spotlist: [],
            unfoldCurrent: 0
        },  // 景点
        searchValue: '',
        page: {
            pageSize: 8,
            pageNo: 1
        }   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取父分类
        this.getParent().then(res => {
        // 热门的bizType为-1，其它是业务类型ID
            this.getScenic(res.module[0].typeID);
        })
    },

    /**分类切换 */
    handleChange: function (e) {
        const areaList = 'scenic.arealist';
        const spotList = 'scenic.spotlist';
        const pageNo = 'page.pageNo';
        const tabCurrent = 'tab.current';
        this.setData({
            [tabCurrent]: e.detail.key,
            [areaList]: [],
            [spotList]: [],
            [pageNo]: 1
        })
        // 点击选项卡请求不同的详情
        this.getScenic(e.detail.key);
    },

    /**跳转到手绘地图 */
    tohanddrawnMap() {
        wx.navigateTo({
            url: '/pages/qdhzhoubian/qdhzhoubian?typeID=1'
        })
    },

    /**点击跳转到详情页 */
    jumpToInfo({ currentTarget }) {
        const id = currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${id}`
        })
    },

    /**获取父分类 */
    getParent() {
        // 获取分类的url
        const url = `${app.URL}/base/travelType`;
        // 分类请求 type = 1 是旅游
        const promise = app.request(url, 'post', {type: 1});
        promise.then(res => {
            if (res.resultCode != 1) {
                app.showError('获取分类失败');
                return false
            }
            const tabList = 'tab.list';
            // tabcurrent默认是module数组的第一位
            const tabCurrent = 'tab.current';
            // 添加热门分类
            res.module.unshift({
                typeID: -1,
                typeName: '热门'
            })
            this.setData({
                [tabList]: res.module,
                [tabCurrent]: res.module[0].typeID
            })
        }).catch(() => {
            app.showError('获取分类失败')
        })
        return promise;
    },

    /**获取景区或者景点 */
    getScenic(id) {
        // 显示 loading 提示框
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const lngLat = {
            lng: wx.getStorageSync('longitude'),
            lat: wx.getStorageSync('latitude')
        };
        // 获取景区的URL
        const url = `${app.URL}/spots/search`;
        // 获取景区的参数
        const params = {
            bizType: id,
        };
        Object.assign(params, this.data.page);
        // 请求
        app.request(url, 'post', params).then(res => {
            // 隐藏 loading 提示框
            wx.hideLoading();
            if (res.resultCode != 1) {
                app.showError('获取景区失败');
                return false
            }
            // 遍历res.module，判断item的type值，1是景区，2是景点
            const arealist = [], spotlist = [];
            for (let item of res.module) {
                if (item.type == 1) {
                    // 景区有spotsVOList属性，值为数组，存放这个景区下面的景点列表
                    // 将经纬转化为距离, 保存小数点后2位小数
                    for (let elem of item.spotsVOList) {
                        elem.distance = GetDistance(lngLat.lat, lngLat.lng, elem.latitude, elem.longitude).toFixed(2)
                    }
                    // 默认景区都是展开的
                    item.unfoldCurrent = true;
                    arealist.push(item)
                } else {
                    item.distance = GetDistance(lngLat.lat, lngLat.lng, item.latitude, item.longitude).toFixed(2)
                    spotlist.push(item)
                }
            }
            const preAreaList = this.data.scenic.arealist;
            const preSpotList = this.data.scenic.spotlist;
            // 如果请求的数组为空，下面代码不执行
            if (res.module) {
                preAreaList.push(...arealist);
                preSpotList.push(...spotlist);
            }
            // 景区列表
            const scearealist = 'scenic.arealist';
            const scespotlist = 'scenic.spotlist';
            this.setData({
                [scearealist]: preAreaList,
                [scespotlist]: preSpotList
            })
        }).catch(() => {
            // 隐藏 loading 提示框
            wx.hideLoading();
            app.showError('获取景区列表失败')
        })
    },

    /**点击展开按钮展开 */
    showMore({ currentTarget }) {
        // 被点击景区的ID
        const id = currentTarget.dataset.id;
        const preAreaList = this.data.scenic.arealist;
        // 遍历 取反 原来是展开的收起 原来是收起的展开
        preAreaList.forEach(function(item) {
            if (id == item.id) {
                item.unfoldCurrent = !item.unfoldCurrent;
            }
        })
        const scearealist = 'scenic.arealist';
        this.setData({
            [scearealist]: preAreaList,
        })
    },

    // 点击搜索
    turnToSearch() {
        // type = 1是景点
        wx.navigateTo({
            url: '/pages/searchPage/searchPage?type=1',
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
        this.getScenic(this.data.tab.current)
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