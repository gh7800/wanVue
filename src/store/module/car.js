import { getCarApplyList, createCarApply, deleteCarApply, getCarApplyDetail } from '../../api/car'

const state = {
  // 我的用车列表
  myCarList: [],
  myCarPagination: {
    current: 1,
    per_page: 15,
    total: 0
  },
  myCarLoading: false,
  
  // 当前详情
  currentDetail: null,
  detailLoading: false,
  
  // 提交状态
  submitLoading: false
}

const mutations = {
  // 我的用车列表
  SET_MY_CAR_LIST(state, data) {
    state.myCarList = data
  },
  SET_MY_CAR_PAGINATION(state, pagination) {
    state.myCarPagination = { ...state.myCarPagination, ...pagination }
  },
  SET_MY_CAR_LOADING(state, loading) {
    state.myCarLoading = loading
  },
  
  // 当前详情
  SET_CURRENT_DETAIL(state, detail) {
    state.currentDetail = detail
  },
  SET_DETAIL_LOADING(state, loading) {
    state.detailLoading = loading
  },
  
  // 提交状态
  SET_SUBMIT_LOADING(state, loading) {
    state.submitLoading = loading
  }
}

const actions = {
  // 获取我的用车列表
  async fetchMyCarList({ commit }, params) {
    commit('SET_MY_CAR_LOADING', true)
    try {
      const res = await getCarApplyList({ mine: 1, ...params })
      if (res.data) {
        commit('SET_MY_CAR_LIST', res.data)
        // 支持多种分页数据格式: res.paginator.total 或 res.total
        const total = res.paginator ? res.paginator.total : (res.total || 0)
        commit('SET_MY_CAR_PAGINATION', {
          current: params.page || 1,
          per_page: params.per_page || 15,
          total: total
        })
      }
      return res
    } finally {
      commit('SET_MY_CAR_LOADING', false)
    }
  },
  
  // 获取用车申请详情
  async fetchCarDetail({ commit }, uuid) {
    commit('SET_DETAIL_LOADING', true)
    try {
      const res = await getCarApplyDetail(uuid)
      if (res.data) {
        commit('SET_CURRENT_DETAIL', res.data)
      }
      return res
    } finally {
      commit('SET_DETAIL_LOADING', false)
    }
  },
  
  // 创建用车申请
  async createCarApply({ commit }, data) {
    commit('SET_SUBMIT_LOADING', true)
    try {
      const res = await createCarApply(data)
      return res
    } finally {
      commit('SET_SUBMIT_LOADING', false)
    }
  },
  
  // 删除用车申请
  async deleteCarApply({ commit }, uuid) {
    const res = await deleteCarApply(uuid)
    return res
  }
}

const getters = {
  // 获取我的用车列表
  myCarList: state => state.myCarList,
  myCarPagination: state => state.myCarPagination,
  myCarLoading: state => state.myCarLoading,
  
  // 当前详情
  currentDetail: state => state.currentDetail,
  detailLoading: state => state.detailLoading,
  
  // 提交状态
  submitLoading: state => state.submitLoading
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
