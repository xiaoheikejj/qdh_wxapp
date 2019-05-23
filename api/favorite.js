import request from '../utils/request'

/**
 * 收藏
 * @params type 收藏所属类型 | openID openID | recordID 收藏内容的ID | favoriteDate 收藏的日期
 */
function favoriteCollect(url, type, openID, recordID, favoriteDate) {
    // 参数
    const params = {
        type: type,
        openID: openID,
        recordID: recordID,
        favoriteDate: favoriteDate
    };
    // 请求
    return request(url, 'post', params)
}

/**
 * 取消收藏
 * @params openID 收藏用户openID | type 收藏类型 | recordID 收藏id
 */
function favoriteCancel(url, type, openID, recordID) {
    // 参数
    const params = {
        type: type,
        openID: openID,
        recordID: recordID
    };
    // 请求
    return request(url, 'post', params)
}

/**
 * 获取收藏夹信息列表
 */
function favoriteList(url, openID, type) {
    // 参数
    const params = {
        openID: openID,
        type: type
    };
    // 请求
    return request(url, 'post', params)
}

export { favoriteCollect, favoriteCancel, favoriteList }