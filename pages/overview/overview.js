const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        result: {}, // 存储概述数据的对象
        userBaseInfo: {
            userName: '',
            openID: '',
            longitude: 0,
            latitude: 0
        },  // 储存用于请求参数的用户基本信息
        audio: {
            status: false,
            innerAudioContext: null
        },
        duration: "00:00",
        currentTime: "00:00",
        sliderVal: 0,
        sliderDis: false,
        audio_length: "",
        recommend: {
            recommendList: [],  // 热门推荐列表
            recommendShowList: [],  // 点击热门推荐分类显示的列表
            type: 1,  // 点击热门推荐切换后的类型，默认是1
        },
        travelGuide: {
            list: []
        },
        video_array: [],
        canvas: {
            show: false
        },  // canvas 对象
        introMore: false,   //  概述简介显示更多
        wxCode: '',
        showFullScreen: false,   // 关闭显示全屏显示按钮
        // page: {
        //     pageSize: 6,
        //     pageNo: 1
        // }   //  每页多少条，第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userName = 'userBaseInfo.userName';
        const openID = 'userBaseInfo.openID';
        const longitude = 'userBaseInfo.longitude';
        const latitude =  'userBaseInfo.latitude';
        // 语音对象
        const innerAudioContext = 'audio.innerAudioContext';
        this.setData({
            [innerAudioContext]: wx.createInnerAudioContext(),
            [userName]: wx.getStorageSync("userInfo").nickName,
            [openID]: wx.getStorageSync("openID").data,
            [longitude]: wx.getStorageSync("longitude"),
            [latitude]: wx.getStorageSync("latitude")
        })
        this.data.audio.innerAudioContext.seek(0);//设置音频初始位置为0
        // 请求获取景区概况
        this.getOverViewInfo();
        // 首先判断图片是否已存在
        // 1. 存在直接读取
        // 2. 不存在直接调用此接口，然后一次性生成小程序码图片
        wx.getImageInfo({
            src: `${app.baseUrl}/qdh-qrcode/0-1.png`,
            complete: res => {
                // 如果图片路径访问不到res.width 是undefined, 真机中是-1, 真机测试才可通过
                res.width > 0 ? console.log(true) : this.getCodeMart();
                if (res.path) {
                    this.setData({
                        wxCode: res.path
                    })
                }
            }
        })
    },

    /**获取概况 基本信息 */
    getOverViewInfo() {
        wx.showLoading({
            title: '加载中',
        })
        const [url, target] = [`${app.URL}/home/index`, {}];
        const params = {};
        Object.assign(params, this.data.userBaseInfo, {userID: 1});
        app.request(url, 'post', params).then(res => {
            if (res.code === 1) {
                const result = res.data.info;
                //概述的slider集合
                wx.setStorageSync("viewInfoSliderList", result.viewInfoSliderList);
                // 筛选出所有视频,选出第一个视频作为官方推荐视频
                const video_arr = result.viewInfoSliderList.find(item => {
                    return item.sliderType === 0
                })
                // 绘制海报
                const imgList = result.viewInfoSliderList.find(item => {
                    return item.sliderType === 1
                })
                this.setData({
                    video_array: video_arr,
                    // 千岛湖数据
                    result: result
                })
                // 保存音频的链接
                this.data.audio.innerAudioContext.src = result.infoAudioUrl;        
                wx.hideLoading();
            }
        }).catch(err => {
            wx.hideLoading();
            app.showError('获取概述信息失败');
        })
    },

    /**获取千岛湖热门推荐 */
    getTopRecommend() {
        // 热门推荐请求的URL地址
        const url = `${app.URL}/SummaryRecommend/getList`;
        // 获取热门推荐的请求
        app.request(url, 'post').then(res => {
            if (res.resultCode != 1) {
                app.showError('获取热门推荐失败');
                return false
            }
            const recommendList = 'recommend.recommendList';
            // 热门推荐的显示数组默认是type为1
            const recommendShowList = 'recommend.recommendShowList';
            const type = this.data.recommend.type;
            // 用for...of 遍历数组，筛选出 type 和默认type一致的值
            for (let item of res.module) {
                if (type == item.type) {
                    this.setData({
                        [recommendShowList]: item.list
                    })
                }
            }
            this.setData({
                // 热门推荐列表
                [recommendList]: res.module
            })
        }).catch(() => {
            app.showError('获取热门推荐失败')
        })
    },

    /**切换热门推荐 */
    switchTopRecommend({ currentTarget }) {
        // recommend.type随着点击切换
        const type = 'recommend.type';
        this.setData({
            [type]: currentTarget.dataset.type
        })
        // 切换后按照 dataset.type 和 推荐列表中的type进行匹配
        const recommendList = this.data.recommend.recommendList;
        const recommendShowList = 'recommend.recommendShowList';
        for (let item of recommendList) {
            if (currentTarget.dataset.type == item.type) {
                this.setData({
                    [recommendShowList]: item.list
                })
            }
        }
    },

    /**播放视屏 */ 
    play(e) { 
        const videoContext = wx.createVideoContext('primaryVideo');
        //执行全屏方法 
        videoContext.requestFullScreen({direction: 0}); 
    },

    /**视频模式改变 */ 
    screenChange(e) { 
        const videoContext = wx.createVideoContext('primaryVideo');
        const fullScreen = e.detail.fullScreen;
        // 执行退出全屏方法 
        if (!fullScreen) {
            videoContext.pause();
        }
    },

    /**监听滑块滑动 */
    listenerSlider(e) {
        const per = e.detail.value / 100;
        const long = per * this.data.audio_length;
        this.setData({
            currentTime: this.formatDate(long)
        })
        this.data.audio.innerAudioContext.seek(long);
    },

    /**更多视频或图片 */
    turnMoreImg() {
        wx.navigateTo({
            url: "/pages/moreImg/moreImg"
        })
    },

    /**打开内置地图 */
    openMap() {
        wx.openLocation({
            longitude: +this.data.result.longitude,
            latitude: +this.data.result.latitude,
            address: this.data.result.infoAddress,
            name: this.data.result.infoName,
            scale: 10
        })
    },

    /**点击热门推荐跳转到详情 */
    jumpToDetail({ currentTarget }) {
        // 设置dataset变量
        const dataset = currentTarget.dataset;
        // currentType 是用来区分是酒店还是民宿的
        const [id, type, currenttype] = [dataset.id, dataset.type, dataset.currenttype]
        // 如果currenttype不存在就是 景点或者美食
        if (currenttype) {
            // 1 是酒店 2是民宿
            switch (currenttype) {
                case 1:
                    wx.navigateTo({
                        url: `/pages/hotelDetail/hotelDetail?id=${id}`,
                    });
                    break;
                case 2:
                    wx.navigateTo({
                        url: `/pages/legendDetail/legendDetail?id=${id}`,
                    })
                    break;
            }
        } else {
            // 1 是景点， 2是美食
            switch (type) {
                case 1:
                    wx.navigateTo({
                        url: `/pages/scenicAreaDetail/scenicAreaDetail?id=${id}`,
                    });
                    break;
                case 2:
                    wx.navigateTo({
                        url: `/pages/foodDetail/foodDetail?id=${id}`,
                    })
                    break;
            }
        }
    },

    /**获取游记攻略 */
    getTravelGuideList() {
        const list = 'travelGuide.list';
        // 获取攻略游记请求的url
        const url = `${app.URL}/Summary/strategy`;
        // 获取攻略游记请求的参数
        const params = {
            openID: this.data.userBaseInfo.openID,
            type: 1, // -1是全部，1是推荐至概述
        };
        // 获取攻略游记请求
        app.request(url, 'post', params).then(res => {
            if (res.resultCode != 1) {
                app.showError('获取概述游记攻略失败')
            }
            // res.module对象中的isLike,true就是已经点过赞了，false就是没点赞
            // for...of遍历
            for (let item of res.module) {
                if (item.isLike == 1) {
                    item.icon = '../../images/strategy-yidianzan.png'
                } else {
                    item.icon = '../../images/strategy-dianzan.png'
                }
            }
            this.setData({
                [list]: res.module
            })
        })
    },

    /**跳转到攻略游记详情 */
    jumpToStrategy({ currentTarget }) {
        // 显示 loading 提示框
        wx.showLoading({
            title: '跳转中',
            mask: true
        })
        // 获取跳转的ID
        const currentData = currentTarget.dataset;
        this.viewRequest(currentData.id).then(() => {
            wx.hideLoading();
            wx.navigateTo({
                url: `/pages/travelGuideDetail/travelGuideDetail?id=${currentData.id}&isLike=${currentData.islike}`,
            })
        })
    },

    /**播放和暂停 */
    pauseButton() {
        if (this.data.audio.innerAudioContext.paused) {
            this.data.audio.innerAudioContext.play();
            const audiostatus = 'audio.status';
            this.setData({
                sliderDis: false,
                [audiostatus]: true
            })

            setTimeout(() => {
                this.data.audio.innerAudioContext.currentTime;
                //必须先执行onPlay方法，才能继续执行onTimeUpdate方法
                this.data.audio.innerAudioContext.onTimeUpdate(() => {
                    this.setData({
                        duration: this.formatDate(this.data.audio.innerAudioContext.duration),
                        currentTime: this.formatDate(this.data.audio.innerAudioContext.currentTime),
                        audio_length: this.data.audio.innerAudioContext.duration
                    })

                    const per = (this.data.audio.innerAudioContext.currentTime / this.data.audio.innerAudioContext.duration) * 100;
                    //获取当前播放时间所对应的slider位置
                    this.setData({
                        sliderVal: per,//设置slider滑块所在位置
                    })
                })
            }, 500) 
        } else {
            this.data.audio.innerAudioContext.pause();
            const audiostatus = 'audio.status';
            this.setData({
                sliderDis: true,
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
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const audiostatus = 'audio.status';
        // 播放结束
        this.data.audio.innerAudioContext.onEnded(() => {
            this.setData({
                currentTime: "00:00",
                sliderVal: 0,
                [audiostatus]: false
            })
        })
    },

    /**跳转到全景漫游 */
    turnToFullView() {
        wx.navigateTo({
            url: "/pages/fullView/fullView"
        })
    },

    /**跳转到语音导览 */
    turnToAudio() {
        wx.switchTab({
            url: "/pages/qdhAudio/qdhAudio"
        })
    },

    /**跳转到文体场馆 */
    turnToCulture() {
        wx.navigateTo({
            url: "/pages/museum/museum"
        })
    },

    /**添加观看人数 */
    viewRequest(id) {
        // 发送给后台已点赞
        const [url, target] = [`${app.URL}/strategy/view`, {}];
        const params = {};
        Object.assign(params, this.data.userBaseInfo, {id: id, status: 1});
        return app.request(url, 'post', params);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取热门推荐列表
        this.getTopRecommend();
        // 获取游记攻略列表
        this.getTravelGuideList();
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
        this.data.audio.innerAudioContext.stop()    //退出页面后停止播放
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
        this.drawCanvas(this.data.result.posterImg, '千岛湖概述', this.data.result.infoDesc, this.data.result.infoAddress);
        this.setData({
            [canvasshow]: true,
        })
    },

    /**获取菊花码 */
    getCodeMart() {
        const url = `${app.URL}/wxShareQRCode/getQRCode`;
        const params = {
            url: 'pages/overview/overview',
            type: 0,
            id: 1
        };
        app.request(url, 'post', params).then(() => {
            wx.getImageInfo({
                // 美食的业务类型是5
                src: `${app.baseUrl}/qdh-qrcode/0-1.png`,
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

    /**景区概述下拉 */
    dropDown() {
        if (this.data.introMore) {
            this.setData({
                introMore: false
            })
            return false
        }
        this.setData({
            introMore: true
        })
    }
})