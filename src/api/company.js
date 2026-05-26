import request from '../utils/request'

/**
 * 获取公司列表（扁平）
 * @returns {Promise}
 */
export function getCompanyList() {
  return request({
    url: '/api/company',
    method: 'GET'
  })
}

/**
 * 获取公司树形结构
 * @returns {Promise}
 */
export function getCompanyTree() {
  return request({
    url: '/api/company/tree',
    method: 'GET'
  })
}

/**
 * 获取单个公司
 * @param {string} uuid - 公司UUID
 * @returns {Promise}
 */
export function getCompany(uuid) {
  return request({
    url: `/api/ company/${uuid}`,
    method: 'GET'
  })
}

/**
 * 创建公司
 * @param {Object} data - 公司数据
 * @param {string} data.name - 公司名称
 * @param {string} [data.parent_id] - 上级公司UUID
 * @param {string} [data.logo] - 公司logo
 * @param {number} [data.status] - 状态：0=正常，1=禁用
 * @param {number} [data.sort] - 排序值
 * @returns {Promise}
 */
export function createCompany(data) {
  return request({
    url: '/api/company',
    method: 'POST',
    data
  })
}

/**
 * 更新公司
 * @param {string} uuid - 公司UUID
 * @param {Object} data - 公司数据
 * @param {string} [data.name] - 公司名称
 * @param {string} [data.parent_id] - 上级公司UUID
 * @param {string} [data.logo] - 公司logo
 * @param {number} [data.status] - 状态：0=正常，1=禁用
 * @param {number} [data.sort] - 排序值
 * @returns {Promise}
 */
export function updateCompany(uuid, data) {
  return request({
    url: `/api/company/${uuid}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除公司
 * @param {string} uuid - 公司UUID
 * @returns {Promise}
 */
export function deleteCompany(uuid) {
  return request({
    url: `/api/company/${uuid}`,
    method: 'DELETE'
  })
}
