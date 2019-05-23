/**
 * @desc API请求接口
 * @author 张顺祥
 * @date 2018-11-10
 */
function requestApi(url, method, params) {
    let promise = new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: method,
            data: params,
            header: { "content-type": "application/x-www-form-urlencoded" },
            success: res => {
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
    return promise
}

export default requestApi