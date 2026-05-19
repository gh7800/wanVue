import request from '../utils/request'

/**
 * 获取车牌列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.per_page - 每页条数
 * @param {string} params.plate_number - 车牌号
 */
export function getPlateList(params) {
  return request({
    url: '/api/car/plate',
    method: 'get',
    params
  })
}

/**
 * 新增车牌
 * @param {Object} data - 车牌数据
 * @param {string} data.plate_number - 车牌号
 */
export function addPlate(data) {
  return request({
    url: '/api/car/plate',
    method: 'post',
    data
  })
}

/**
 * 编辑车牌
 * @param {string} uuid - 车牌UUID
 * @param {Object} data - 车牌数据
 * @param {string} data.plate_number - 车牌号
 */
export function updatePlate(uuid, data) {
  return request({
    url: `/api/car/plate/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除车牌
 * @param {string} uuid - 车牌UUID
 */
export function deletePlate(uuid) {
  return request({
    url: `/api/car/plate/${uuid}`,
    method: 'delete'
  })
}

/**
 * 获取用车申请列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.per_page - 每页条数
 * @param {number} params.mine - 是否我的用车(1=是)
 */
export function getCarApplyList(params) {
  return request({
    url: '/api/car/apply',
    method: 'get',
    params
  })
}

/**
 * 获取用车申请详情
 * @param {string} uuid - 申请UUID
 */
export function getCarApplyDetail(uuid) {
  return request({
    url: `/api/car/apply/${uuid}`,
    method: 'get'
  })
}

/**
 * 创建用车申请
 * @param {Object} data - 用车申请数据
 * @param {string} data.car_type - 用车类型(general=一般用车, business=业务用车, other=其他)
 * @param {string} data.reason - 用车事由
 * @param {number} data.passenger_count - 用车人数
 * @param {string} data.use_time - 用车时间
 * @param {string} data.remark - 备注
 */
export function createCarApply(data) {
  return request({
    url: '/api/car/apply',
    method: 'post',
    data
  })
}

/**
 * 更新用车申请
 * @param {string} uuid - 申请UUID
 * @param {Object} data - 用车申请数据
 */
export function updateCarApply(uuid, data) {
  return request({
    url: `/api/car/apply/${uuid}`,
    method: 'put',
    data
  })
}

/**
 * 删除用车申请
 * @param {string} uuid - 申请UUID
 */
export function deleteCarApply(uuid) {
  return request({
    url: `/api/car/apply/${uuid}`,
    method: 'delete'
  })
}

/**
 * 获取待处理的用车审批列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.per_page - 每页条数
 */
export function getCarApproveTodo(params) {
  return request({
    url: '/api/car/approve/todo',
    method: 'get',
    params
  })
}

/**
 * 获取已处理的用车审批列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.per_page - 每页条数
 */
export function getCarApproveDone(params) {
  return request({
    url: '/api/car/approve/done',
    method: 'get',
    params
  })
}

/**
 * 审批用车申请
 * @param {Object} data - 审批数据
 * @param {string} data.uuid - 申请UUID
 * @param {string} data.action - 审批操作(agree=同意, reject=驳回)
 * @param {string} data.reply - 审批意见
 * @param {string} data.plate_id - 分配的车牌ID(step=3同意时需要)
 */
export function approveCarApply(data) {
  return request({
    url: '/api/car/approve',
    method: 'post',
    data
  })
}

/**
 * 结束用车
 * @param {string} uuid - 申请UUID
 * @param {Object} data - 结束用车数据
 * @param {number} data.start_km - 开始公里数
 * @param {number} data.end_km - 结束公里数
 */
export function endCarApply(uuid, data) {
  return request({
    url: `/api/car/end/${uuid}`,
    method: 'post',
    data
  })
}
