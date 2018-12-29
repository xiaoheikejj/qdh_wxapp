/**
 * @desc API请求接口
 * @author 张顺祥
 * @date 2018-11-10
 */

/**
 * @param {string} url 接口地址
 * @param {object} params 请求的参数
 * @param {object} sourceobj 来源对象
 * @param {Function} successFun 接口成功后的回调函数
 * @param {Function} failFun 接口失败后的回调函数
 * @param {Function} completeFun 
 */

function requestApi(url, params, method, successFun, failFun, completeFun, sourceobj) {
  var contentType;
  if (method === "post") {
    contentType = "application/x-www-form-urlencoded"
  } else {
    contentType = "application/json"
  }
  wx.request({
    url: url,
    method: method,
    data: params,
    header: { "Content-Type": contentType },
    success: function (res) {
      successFun(res.data)
    },
    fail: function (err) {
      failFun(err)
    },
    complete: function (info) {

    }
  })
}

module.exports = {
  requestApi
}