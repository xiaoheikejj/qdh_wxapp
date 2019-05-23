import request from '../utils/request'

/**
 * 获取不同系统标签
 * @params bizType 不同的业务类型
 */
function getTag(url, bizType) {
    return request(url, 'post', {bizType: bizType})
}

export { getTag }