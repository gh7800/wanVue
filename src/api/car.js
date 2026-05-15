import request from '../utils/request'

/**
 * 获取车牌列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
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
