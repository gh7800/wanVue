import request from '../utils/request'

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {string} params.username - 用户名
 * @param {string} params.real_name - 真实姓名
 */
export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

/**
 * 新增用户
 * @param {Object} data - 用户数据
 */
export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

/**
 * 编辑用户
 * @param {string} uuid - 用户UUID
 * @param {Object} data - 用户数据
 */
export function updateUser(uuid, data) {
  return request({
    url: `/api/user/update/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {string} uuid - 用户UUID
 */
export function deleteUser(uuid) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data: { uuid }
  })
}

/**
 * 批量删除用户
 * @param {Array} ids - 用户ID数组
 */
export function batchDeleteUser(ids) {
  return request({
    url: '/api/user/batchDelete',
    method: 'post',
    data: { ids }
  })
}

/**
 * 获取公司列表
 */
export function getCompanyList() {
  return request({
    url: '/api/company',
    method: 'get'
  })
}

/**
 * 获取部门树形列表
 * @param {string} companyUuid - 公司UUID
 */
export function getDepartmentTree(companyUuid) {
  return request({
    url: '/api/department/tree',
    method: 'get',
    params: { company_uuid: companyUuid }
  })
}

/**
 * 获取角色列表
 */
export function getRoleList() {
  return request({
    url: '/api/permission/role',
    method: 'get'
  })
}
