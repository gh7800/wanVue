import request from '../utils/request'

/**
 * 获取部门列表
 * @param {Object} params - 查询参数
 */
export function getDepartmentList(params) {
  return request({
    url: '/api/department',
    method: 'get',
    params
  })
}

/**
 * 获取部门树形结构
 * @param {Object} params - 查询参数
 */
export function getDepartmentTree(params) {
  return request({
    url: '/api/department/tree',
    method: 'get',
    params
  })
}

/**
 * 添加部门
 * @param {Object} data - 部门数据
 */
export function addDepartment(data) {
  return request({
    url: '/api/department',
    method: 'post',
    data
  })
}

/**
 * 获取部门详情
 * @param {string} uuid - 部门UUID
 */
export function getDepartmentDetail(uuid) {
  return request({
    url: `/api/department/${uuid}`,
    method: 'get'
  })
}

/**
 * 编辑部门
 * @param {string} uuid - 部门UUID
 * @param {Object} data - 部门数据
 */
export function updateDepartment(uuid, data) {
  return request({
    url: `/api/department/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除部门
 * @param {string} uuid - 部门UUID
 */
export function deleteDepartment(uuid) {
  return request({
    url: `/api/department/${uuid}`,
    method: 'delete'
  })
}
