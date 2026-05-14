import request from '@/utils/request'

/**
 * 获取个人信息
 */
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

/**
 * 更新个人信息
 * @param {Object} data - 用户数据
 */
export function updateUserInfo(data) {
  return request({
    url: '/api/user/info',
    method: 'put',
    data
  })
}

/**
 * 修改密码
 * @param {Object} data - { old_password, new_password }
 */
export function changePassword(data) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data
  })
}

/**
 * 上传头像
 * @param {FormData} data - 包含头像文件的 FormData
 */
export function uploadAvatar(data) {
  return request({
    url: '/api/user/avatar',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
