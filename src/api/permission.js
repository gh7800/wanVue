import request from '../utils/request'

/**
 * 获取权限列表
 */
export function getPermissionList(params) {
  return request({
    url: '/api/permission',
    method: 'get',
    params
  })
}

/**
 * 创建权限
 * @param {Object} data - 权限数据
 */
export function addPermission(data) {
  return request({
    url: '/api/permission',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * @param {string} uuid - 权限UUID
 * @param {Object} data - 权限数据
 */
export function updatePermission(uuid, data) {
  return request({
    url: `/api/permission/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除权限
 * @param {string} uuid - 权限UUID
 */
export function deletePermission(uuid) {
  return request({
    url: `/api/permission/${uuid}`,
    method: 'delete'
  })
}

/**
 * 批量删除权限
 * @param {Array} uuids - 权限UUID数组
 */
export function batchDeletePermission(uuids) {
  return request({
    url: '/api/permission/batch',
    method: 'delete',
    data: { uuids }
  })
}
