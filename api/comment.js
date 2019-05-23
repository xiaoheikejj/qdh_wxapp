import request from '../utils/request'

/**获取评论列表 */
function getComments(url, params) {
    return request(url, 'post', params)
}

export default getComments