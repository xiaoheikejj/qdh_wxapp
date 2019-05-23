//获取应用实例
const app = getApp()
import { favoriteCollect, favoriteCancel } from '../../api/favorite'
import { formatTime } from '../../utils/util'
import comment from '../../api/comment'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        result: {},    // 详细数据
        scenicID: 0,    // 景点ID
        showMore: false,    // 展开更多默认是false
        userInfo: {
            openID: ''
        },
        comm: {
            list: []
        },  // 评论
        classify: {
            active: 0,
            currentNum: 1
        },
        audio: {
            innerAudioContext: null,
            status: false,
            duration: '00:00',
            currentTime: '00:00',
            audiolen: '',
            sliderval: 0,
            sliderdis: false
        },  // 语音
        canvas: {
            show: false
        },  // canvas 对象
        wxCode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userInfoOpenID = 'userInfo.openID';
        const innerAudioContext = 'audio.innerAudioContext';
        // 创建语音对象
        this.setData({
            [innerAudioContext]: wx.createInnerAudioContext(),
            [userInfoOpenID]: wx.getStorageSync('openID').data
        })
        // 在当前页面显示导航条加载动画
        wx.showNavigationBarLoading()
        // 赋值给景点ID
        this.setData({
            scenicID: options.id
        })
        // 获取实时评论
        this.getComment(options.id);
        // 首先判断图片是否已存在
        // 1. 存在直接读取
        // 2. 不存在直接调用此接口，然后一次性生成小程序码图片
        wx.getImageInfo({
            // 景点的业务类型是1
            src: `${app.baseUrl}/qdh-qrcode/1-${options.id}.png`,
            complete: res => {
                // 如果图片路径访问不到res.width 是undefined, 真机中是-1, 真机测试才可通过
                res.width > 0 ? console.log(true) : this.getCodeMart(options.id);
                if (res.path) {
                    this.setData({
                        wxCode: res.path
                    })
                }
            }
        })
    },

    /**点击展开更多 */
    bindMore() {
        // 之前的showmore
        const showMore = this.data.showMore;
        // 和之前的showMore取反
        this.setData({
            showMore: !showMore
        })
    },

    /**获取用户评论 */
    getComment(id) {
        // 获取用户评论url
        const url = `${app.URL}/base/getComments`;
        // bizType 景点是 1
        const params = {
            bizType: 1,
            recordID: id
        };
        comment(url, params).then(res => {
            if (res.resultCode != 1) {
                return false
            }
            // 去掉每一项日期的后缀.0
            for (let item of res.module) {
                item.commentDate = item.commentDate.split('.0')[0]
            }
            const commentlist = 'comm.list';
            this.setData({
                [commentlist]: res.module
            })
        }).catch(() => {
            
        })
    },

    /**点击分类切换的函数 */
    classifyChangeFun(e) {
        const type = e.currentTarget.dataset.type;
        const classifyActive = 'classify.active';
        // + string转化为number
        const classifyCurrent = 'classify.currentNum';
        // 当前轮播的下标为1
        this.setData({
            [classifyActive]: +type,
            [classifyCurrent]: 1
        })
        // 在全景选项的时候跳转到webview页面
        if (type == 2) {
            wx.navigateTo({
                url: `/pages/examinePanorama/examinePanorama?url=${this.data.result.vrs[0].resourceUrl}`,
            })
        }
    },

    /**轮播图改变 */
    currentChangeFun(e) {
        const classifyCurrent = 'classify.currentNum';
        this.setData({
            [classifyCurrent]: e.detail.current + 1
        })
    },

    /**获取景点详情 */
    getInformation(id) {
        wx.showLoading({
            title: '加载中',
        })
        // 获取景点详情的URL
        const url = `${app.URL}/spots/info`;
        // 获取景点的参数
        const params = {
            spotsID: id,
            openID: this.data.userInfo.openID
        };
        const promise = app.request(url, 'post', params);
        // 请求景点详情
        promise.then(res => {
            wx.hideLoading()
            // 如果resultCode不等于1, 请求错误，不执行后面一系列操作
            if (res.resultCode != 1) {
                app.showError('获取景点详情失败');
                return false
            }
            // 挂上语音链接
            this.data.audio.innerAudioContext.src = res.module.audioUrl
            this.setData({
                result: res.module
            })
            const classifyActive = 'classify.active';
            // 视频图片全景
            if (res.module.imgs.length) {
                this.setData({
                    [classifyActive]: 0
                })
                return false
            }
            if (res.module.videos.length) {
                this.setData({
                    [classifyActive]: 1
                })
                return false
            }
            if (res.module.vrs.length) {
                this.setData({
                    [classifyActive]: 2
                })
                return false
            }
            this.setData({
                [classifyActive]: -1
            })
            return false
        }).catch(() => {
            wx.hideLoading();
            app.showError('获取景点详情失败')
        })
        return promise
    },

    /**收藏景点 */
    collectScenic() {
        const collection = 'result.collection';
        // 改变collectStatus
        if (this.data.result.collection == 1) {
            this.setData({
                [collection]: 0
            })
            app.saluteHint('已经取消收藏')
        } else {
            this.setData({
                [collection]: 1
            })
            app.saluteHint('收藏成功')
        }
        // 收藏酒店的URL
        const collectUrl = `${app.URL}/favorite/collect`;
        // 取消收藏url
        const cancelUrl = `${app.URL}/favorite/cancel`
        // 转化当前时间格式为‘2019-09-09 10:09:09’
        const date = formatTime(new Date());
        // type = 1是景点
        if (this.data.result.collection == 1) {
            favoriteCollect(collectUrl, 1, this.data.userInfo.openID, this.data.scenicID, date).then(res => {
                if (res.resultCode != 1) {
                    return false
                } else {
                    this.getInformation(this.data.scenicID)
                }
            })
        } else {
            favoriteCancel(cancelUrl, 1, this.data.userInfo.openID, this.data.scenicID).then(res => {
                if (res.resultCode != 1) {
                    return false
                } else {
                    this.getInformation(this.data.scenicID)
                }
            })
        }
    },

    /**监听滑块滑动 */
    listenerSlider(e) {
        // 当前时间
        const currentTime = 'audio.currentTime';
        const per = e.detail.value / 100;
        const long = per * this.data.audio.audiolen;
        this.setData({
            [currentTime]: this.formatDate(long)
        })
        this.data.audio.innerAudioContext.seek(long);
    },
   
    /**播放和暂停 */
    pauseButton() {
        if (this.data.audio.innerAudioContext.paused) {
            this.data.audio.innerAudioContext.play();
            // 语音即将出现的状态
            const audiostatus = 'audio.status';
            const sliderdis = 'audio.sliderdis';
            this.setData({
                [sliderdis]: false,
                [audiostatus]: true
            })
            // 语音总时间
            const duration = 'audio.duration';
            // 当前时间
            const currentTime = 'audio.currentTime';
            const audiolen = 'audio.audiolen';
            const sliderval = 'audio.sliderval';
            setTimeout(() => {
                this.data.audio.innerAudioContext.currentTime;
                //必须先执行onPlay方法，才能继续执行onTimeUpdate方法
                this.data.audio.innerAudioContext.onTimeUpdate(() => {
                    this.setData({
                        [duration]: this.formatDate(this.data.audio.innerAudioContext.duration),
                        [currentTime]: this.formatDate(this.data.audio.innerAudioContext.currentTime),
                        [audiolen]: this.data.audio.innerAudioContext.duration
                    })
                    const per = (this.data.audio.innerAudioContext.currentTime / this.data.audio.innerAudioContext.duration) * 100; 
                    //获取当前播放时间所对应的slider位置
                    this.setData({
                        [sliderval]: per,//设置slider滑块所在位置
                    })
                })
            }, 500)
        } else {
            // 语音即将出现的状态
            const audiostatus = 'audio.status';
            const sliderdis = 'audio.sliderdis';
            this.data.audio.innerAudioContext.pause();
            this.setData({
                [sliderdis]: true,
                [audiostatus]: false
            })
        }
    },

    formatDate(date) {
        if (date > 60) {
            return this.formatNumber(parseInt(date / 60)) + ":" + this.formatNumber(parseInt(date % 60))
        } else {
            return "00:" + this.formatNumber(parseInt(date))
        }
    },
    // 前面添加0
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },

    /**拨打电话 */
    dial() {
        wx.makePhoneCall({
            phoneNumber: this.data.result.telno,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const currentTime = 'audio.currentTime';
        // 语音即将出现的状态
        const audiostatus = 'audio.status';
        const sliderval = 'audio.sliderval'
        // 播放结束
        this.data.audio.innerAudioContext.onEnded(() => {
            this.setData({
                [currentTime]: "00:00",
                [sliderval]: 0,
                [audiostatus]: false
            })
        })
    },

    /**打开地图 */
    openMap() {
        wx.openLocation({
            longitude: +this.data.result.longitude,
            latitude: +this.data.result.latitude,
            name: this.data.result.spotsName,
            address: this.data.result.address
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getInformation(this.data.scenicID).then(res => {
            wx.setNavigationBarTitle({
                title: res.module.spotsName
            })
            // 在当前页面隐藏导航条加载动画
            wx.hideNavigationBarLoading()
        })
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
        this.data.audio.innerAudioContext.src = '';
        this.data.audio.innerAudioContext.stop()  //退出页面后停止播放
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

    /**保存图片到相册 */
    saveImage() {
        const canvasshow = 'canvas.show';
        wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            fileType: 'png',
            success: res => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    complete: res => {
                        app.showError('图片保存成功')
                        // 关闭poster-show
                        this.setData({
                            [canvasshow]: false
                        })
                    }
                })
            }
        })
    },

    /**关闭海报 */
    removePoseter() {
        const canvasshow = 'canvas.show';
        this.setData({
            [canvasshow]: false
        })
    },

    /**打开海报 */
    getPoster() {
        const canvasshow = 'canvas.show';
        // 如果posterImg图片不存在，就给posterImg设置默认图片
        if (!this.data.result.posterImg) {
            this.data.result.posterImg = 'https://develop.magicreal.net/qdh-qrcode/posterImg.jpeg'
        }
        this.drawCanvas(this.data.result.posterImg, this.data.result.spotsName, this.data.result.summary, this.data.result.address);
        this.setData({
            [canvasshow]: true,
        })
    },

    /**获取菊花码 */
    getCodeMart() {
        const url = `${app.URL}/wxShareQRCode/getQRCode`;
        const params = {
            url: 'pages/scenicAreaDetail/scenicAreaDetail',
            type: 1,
            id: this.data.scenicID
        };
        app.request(url, 'post', params).then(() => {
            wx.getImageInfo({
                // 美食的业务类型是5
                src: `${app.baseUrl}/qdh-qrcode/1-${this.data.scenicID}.png`,
                complete: res => {
                    if (res.path) {
                        this.setData({
                            wxCode: res.path
                        })
                    }
                }
            })
        })
    },

    /**绘制canvas */
    drawCanvas(image, title, text, address) {
        wx.getImageInfo({
            src: image,
            success: res => {
                let rpx;
                // 获取屏幕宽度，获取自适应单位
                wx.getSystemInfo({
                    success: function (res) {
                        rpx = res.windowWidth / 375;
                    },
                })
                const ctx = wx.createCanvasContext("myCanvas");
                let interTitle = title.length > 6 ? title.substring(0, 6) : title;
                // 画图
                ctx.setFillStyle("#fff");
                ctx.fillRect(0, 0, 260 * rpx, 366 * rpx);
                ctx.drawImage(res.path, 11 * rpx, 11 * rpx, 238 * rpx, 238 * rpx);
                ctx.drawImage("../../images/qdh_canvas.png", 0 * rpx, 249 * rpx, 148 * rpx, 118 * rpx);
                ctx.setFillStyle("#262626");
                ctx.setFontSize(12 * rpx);
                ctx.fillText(interTitle, 78 * rpx, 306 * rpx);
                ctx.setFillStyle("#a2a2a2");
                ctx.setFontSize(8 * rpx);
                ctx.fillText(address, 17 * rpx, 326 * rpx);
                ctx.fillText("识别小程序码查看详情", 163 * rpx, 325 * rpx);
                ctx.fillText("分享自「千岛湖小程序」", 161 * rpx, 338 * rpx);
                ctx.drawImage(this.data.wxCode, 179 * rpx, 270 * rpx, 43 * rpx, 43 * rpx);
                ctx.beginPath();
                ctx.setStrokeStyle("#ffffff");
                ctx.moveTo(11 * rpx, 11 * rpx);
                ctx.lineTo(11 * rpx, 21 * rpx);
                ctx.quadraticCurveTo(11 * rpx, 11 * rpx, 21 * rpx, 11 * rpx);
                ctx.closePath();
                ctx.setFillStyle("#ffffff");
                ctx.fill();
                ctx.beginPath();
                ctx.setStrokeStyle("#ffffff");
                ctx.moveTo(249 * rpx, 11 * rpx);
                ctx.lineTo(249 * rpx, 21 * rpx);
                ctx.quadraticCurveTo(249 * rpx, 11 * rpx, 239 * rpx, 11 * rpx);
                ctx.closePath();
                ctx.setFillStyle("#ffffff");
                ctx.fill();
                ctx.beginPath();
                ctx.setStrokeStyle("#ffffff");
                ctx.moveTo(11 * rpx, 249 * rpx);
                ctx.lineTo(11 * rpx, 239 * rpx);
                ctx.quadraticCurveTo(11 * rpx, 249 * rpx, 21 * rpx, 249 * rpx);
                ctx.closePath();
                ctx.setFillStyle("#ffffff");
                ctx.fill();
                ctx.beginPath();
                ctx.setStrokeStyle("#ffffff");
                ctx.moveTo(249 * rpx, 249 * rpx);
                ctx.lineTo(249 * rpx, 239 * rpx);
                ctx.quadraticCurveTo(249 * rpx, 249 * rpx, 239 * rpx, 249 * rpx);
                ctx.closePath();
                ctx.setFillStyle("#ffffff");
                ctx.fill();
                ctx.setStrokeStyle("#ffffff");
                ctx.strokeRect(11 * rpx, 11 * rpx, 238 * rpx, 238 * rpx);
                ctx.draw()
            }
        })
    },

    /**canvas文字分段 */
    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
        let strLength = 0; // text byte length
        let rows = 1;
        let str = 0;
        let arr = [];
        for (let j = 0; j < text.length; j++) {
            if (text.charCodeAt(j) > 255) {
                strLength += 2;
                if (strLength > rows * num) {
                    strLength++;
                    arr.push(text.slice(str, j));
                    str = j;
                    rows++;
                }
            } else {
                strLength++;
                if (strLength > rows * num) {
                    arr.push(text.slice(str, j));
                    str = j;
                    rows++;
                }
            }
        }
        arr.push(text.slice(str, text.length));
        return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
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