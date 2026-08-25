import request from '../utils/request'

/**
 * 公文管理 - 请示 / 收文接口封装
 */

/**
 * 获取请示列表（收文管理-全部）
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.per_page - 每页条数
 * @param {string} params.keyword - 关键字（标题/内容/备注/申请人）
 * @param {string} params.type - 请示类型（zongbanhui/dangweihui/dongshihui）
 */
export function getDocumentList(params) {
  return request({
    url: '/api/document/list',
    method: 'get',
    params
  })
}

/**
 * 待处理列表（收文管理-待处理）
 * @param {Object} params - 查询参数
 */
export function getDocumentTodo(params) {
  return request({
    url: '/api/document/todo',
    method: 'get',
    params
  })
}

/**
 * 已处理列表（收文管理-已处理）
 * @param {Object} params - 查询参数
 */
export function getDocumentProcessed(params) {
  return request({
    url: '/api/document/processed',
    method: 'get',
    params
  })
}

/**
 * 我的请示列表（查看我申请的请示）
 * @param {Object} params - 查询参数
 */
export function getDocumentMine(params) {
  return request({
    url: '/api/document/mine',
    method: 'get',
    params
  })
}

/**
 * 新增请示
 * @param {Object} data - 请示数据
 * @param {string} data.title - 标题
 * @param {string} data.type - 类型(zongbanhui=总办会/dangweihui=党委会/dongshihui=董事会)
 * @param {string} data.content - 内容
 * @param {string} data.remark - 备注
 * @param {Array} data.files - 附件 [{file_name, file_path, title}]
 */
export function createDocument(data) {
  return request({
    url: '/api/document/add',
    method: 'post',
    data
  })
}

/**
 * 请示详情（含添加人单位、部门、审批流程）
 * @param {string} uuid - 请示UUID
 */
export function getDocumentDetail(uuid) {
  return request({
    url: `/api/document/${uuid}`,
    method: 'get'
  })
}

/**
 * 删除请示
 * @param {string} uuid - 请示UUID
 */
export function deleteDocument(uuid) {
  return request({
    url: `/api/document/delete/${uuid}`,
    method: 'post'
  })
}

/**
 * 审批请示
 * @param {Object} data - 审批数据
 * @param {string} data.uuid - 请示UUID
 * @param {string} data.action - 审批操作(agree=同意, reject=驳回)
 * @param {string} data.reply - 审批意见
 */
export function approveDocument(data) {
  return request({
    url: '/api/document/approval',
    method: 'post',
    data
  })
}

/**
 * 上传附件（多选）
 * @param {FormData} formData - formData.append('files[]', file)
 */
export function uploadDocumentFiles(formData) {
  return request({
    url: '/api/upload',
    method: 'post',
    data: formData
  })
}
