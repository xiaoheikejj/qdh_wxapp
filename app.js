import request from "./utils/request"
import { showError, saluteHint } from './utils/util'

App({
    request: request,
    showError: showError,
    saluteHint: saluteHint,
    onLaunch: function () {
        // 获取调用凭证
        wx.request({
            url: `${this.URL}/login/getCode?url=https://www.en.com`,
            method: "get",
            header: {"content-type": "application/x-www-form-urlencoded"},
            success: res => {
                wx.setStorageSync("access_token", res.data.data.accessToken)
            }
        })
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    //发起网络请求
                    request(`${this.URL}/login/getOpenID`, 'post', { code: res.code }).then(res => {
                        if (res.code === 1) {
                            wx.setStorageSync('openID', res)
                        } else {
                            showError('微信openID获取失败')
                        }
                    })
                } else {
                    console.log(`登录失败！${res.errMsg}`)
                }
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // userinfo存储在storage上
                            wx.setStorageSync("userInfo", res.userInfo)
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        
        // 获取手机信息
        wx.getSystemInfo({
            success: res => {
                let deviceModel = 'iPhone X';
                if (res.model.indexOf(deviceModel) !== -1) {
                    this.globalData.isIpX = true;
                } else {
                    this.globalData.isIpX = false;
                }
            }
        })
    },
    URL: 'https://yunnanapi.magicreal.net/wxapp',
    baseUrl: 'https://develop.magicreal.net',
    globalData: {
        userInfo: null,
        isIpX: true
    }
})