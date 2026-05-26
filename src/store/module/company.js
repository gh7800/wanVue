import {
  getCompanyList,
  getCompanyTree,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from '../../api/company'

const state = {
  companyList: [],
  companyTree: [],
  loading: false,
  searchForm: {
    name: '',
    status: ''
  }
}

const mutations = {
  SET_COMPANY_LIST(state, list) {
    state.companyList = list
  },
  SET_COMPANY_TREE(state, tree) {
    state.companyTree = tree
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_SEARCH_FORM(state, form) {
    state.searchForm = { ...state.searchForm, ...form }
  },
  RESET_SEARCH_FORM(state) {
    state.searchForm = {
      name: '',
      status: ''
    }
  }
}

const actions = {
  // 获取公司列表（扁平）
  async fetchCompanyList({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await getCompanyList()
      if (res.success) {
        commit('SET_COMPANY_LIST', res.data || [])
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取公司列表失败:', error)
      return { success: false, message: '获取公司列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取公司树形结构
  async fetchCompanyTree({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await getCompanyTree()
      if (res.success) {
        commit('SET_COMPANY_TREE', res.data || [])
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取公司树失败:', error)
      return { success: false, message: '获取公司树失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 获取单个公司
  async fetchCompany({ commit }, uuid) {
    try {
      const res = await getCompany(uuid)
      if (res.success) {
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取公司详情失败:', error)
      return { success: false, message: '获取公司详情失败' }
    }
  },

  // 创建公司
  async createCompany({ dispatch }, companyData) {
    try {
      const res = await createCompany(companyData)
      if (res.success) {
        dispatch('fetchCompanyTree')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('创建公司失败:', error)
      return { success: false, message: '创建公司失败' }
    }
  },

  // 更新公司
  async updateCompany({ dispatch }, { uuid, data }) {
    try {
      const res = await updateCompany(uuid, data)
      if (res.success) {
        dispatch('fetchCompanyTree')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('更新公司失败:', error)
      return { success: false, message: '更新公司失败' }
    }
  },

  // 删除公司
  async deleteCompany({ dispatch }, uuid) {
    try {
      const res = await deleteCompany(uuid)
      if (res.success) {
        dispatch('fetchCompanyTree')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('删除公司失败:', error)
      return { success: false, message: '删除公司失败' }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
