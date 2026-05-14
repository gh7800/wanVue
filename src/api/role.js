import request from '../utils/request'

/**
 * 获取角色列表
 */
export function getRoleList() {
  return request({
    url: '/api/permission/role',
    method: 'get'
  })
}

/**
 * 创建角色
 * @param {Object} data - 角色数据
 */
export function addRole(data) {
  return request({
    url: '/api/permission/role',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * @param {string} uuid - 角色UUID
 * @param {Object} data - 角色数据
 */
export function updateRole(uuid, data) {
  return request({
    url: `/api/permission/role/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除角色
 * @param {string} uuid - 角色UUID
 */
export function deleteRole(uuid) {
  return request({
    url: `/api/permission/role/${uuid}`,
    method: 'delete'
  })
}

/**
 * 添加成员到角色
 * @param {string} uuid - 角色UUID
 * @param {Object} data - { user_uuid }
 */
export function addRoleUser(uuid, data) {
  return request({
    url: `/api/permission/role/${uuid}/user`,
    method: 'post',
    data
  })
}

/**
 * 从角色移除成员
 * @param {string} uuid - 角色UUID
 * @param {string} userUuid - 用户UUID
 */
export function removeRoleUser(uuid, userUuid) {
  return request({
    url: `/api/permission/role/${uuid}/user/${userUuid}`,
    method: 'delete'
  })
}

/**
 * 给角色添加权限
 * @param {string} uuid - 角色UUID
 * @param {Object} data - { permission_code }
 */
export function addRolePermission(uuid, data) {
  return request({
    url: `/api/permission/role/${uuid}/permission`,
    method: 'post',
    data
  })
}

/**
 * 移除角色权限
 * @param {string} uuid - 角色UUID
 * @param {string} code - 权限编码
 */
export function removeRolePermission(uuid, code) {
  return request({
    url: `/api/permission/role/${uuid}/permission/${code}`,
    method: 'delete'
  })
}
