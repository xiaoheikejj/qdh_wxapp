var request = require("./utils/request.js")

App({
  request: request,
  onLaunch: function () {
    // 获取调用凭证
    wx.request({
      url: `https://budaoapi.magicreal.net/wxapp/login/getCode?url=https://www.en.com`,
      method: "get",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
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
          wx.request({
            url: "https://budaoapi.magicreal.net/wxapp/login/getOpenID",
            method: "post",
            data: {
              code: res.code
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: res => {
              //同步存储openID
              wx.setStorageSync("openID", res.data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
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
    //获取个人地理位置
    wx.getLocation({
      success: res => {
        wx.setStorageSync("longitude", res.longitude);
        wx.setStorageSync("latitude", res.latitude);
      },
    })
  },
  // URL: "http://192.168.3.169:8355/wxapp",
  URL: "https://budaoapi.magicreal.net/wxapp",
  globalData: {
    userInfo: null
  }
})