import request from '../utils/request'

/**
 * 获取权限群组列表
 * @param {Object} params - 查询参数
 */
export function getPermissionGroupList(params) {
  return request({
    url: '/api/permission/group',
    method: 'get',
    params
  })
}

/**
 * 获取权限群组详情
 * @param {string} uuid - 群组UUID
 */
export function getPermissionGroupDetail(uuid) {
  return request({
    url: `/api/permission/group/${uuid}`,
    method: 'get'
  })
}

/**
 * 创建权限群组
 * @param {Object} data - 群组数据
 */
export function addPermissionGroup(data) {
  return request({
    url: '/api/permission/group',
    method: 'post',
    data
  })
}

/**
 * 更新权限群组
 * @param {string} uuid - 群组UUID
 * @param {Object} data - 群组数据
 */
export function updatePermissionGroup(uuid, data) {
  return request({
    url: `/api/permission/group/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除权限群组
 * @param {string} uuid - 群组UUID
 */
export function deletePermissionGroup(uuid) {
  return request({
    url: `/api/permission/group/${uuid}`,
    method: 'delete'
  })
}

/**
 * 批量删除权限群组
 * @param {Array} uuids - 群组UUID数组
 */
export function batchDeletePermissionGroup(uuids) {
  return request({
    url: '/api/permission/group/batch',
    method: 'delete',
    data: { uuids }
  })
}

/**
 * 添加成员到权限群组
 * @param {string} uuid - 群组UUID
 * @param {Object} data - { user_uuid }
 */
export function addGroupUser(uuid, data) {
  return request({
    url: `/api/permission/group/${uuid}/user`,
    method: 'post',
    data
  })
}

/**
 * 从权限群组移除成员
 * @param {string} uuid - 群组UUID
 * @param {string} userUuid - 用户UUID
 */
export function removeGroupUser(uuid, userUuid) {
  return request({
    url: `/api/permission/group/${uuid}/user/${userUuid}`,
    method: 'delete'
  })
}

/**
 * 给权限群组添加权限
 * @param {string} uuid - 群组UUID
 * @param {Object} data - { permission_uuid }
 */
export function addGroupPermission(uuid, data) {
  return request({
    url: `/api/permission/group/${uuid}/permission`,
    method: 'post',
    data
  })
}

/**
 * 移除权限群组权限
 * @param {string} uuid - 群组UUID
 * @param {string} permissionUuid - 权限UUID
 */
export function removeGroupPermission(uuid, permissionUuid) {
  return request({
    url: `/api/permission/group/${uuid}/permission/${permissionUuid}`,
    method: 'delete'
  })
}
