import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUser,
  getCompanyList,
  getDepartmentTree,
  getRoleList
} from '../../api/userManager'

const state = {
  userList: [],
  loading: false,
  page: {
    current: 1,
    size: 10,
    total: 0
  },
  searchForm: {
    username: '',
    real_name: ''
  },
  // 公司、部门、角色数据
  companyList: [],
  departmentList: [],
  roleList: []
}

const mutations = {
  SET_USER_LIST(state, list) {
    state.userList = list
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PAGE(state, page) {
    state.page = { ...state.page, ...page }
  },
  SET_SEARCH_FORM(state, form) {
    state.searchForm = { ...state.searchForm, ...form }
  },
  RESET_SEARCH_FORM(state) {
    state.searchForm = {
      username: '',
      real_name: ''
    }
    state.page.current = 1
  },
  // 公司、部门、角色 mutations
  SET_COMPANY_LIST(state, list) {
    state.companyList = list
  },
  SET_DEPARTMENT_LIST(state, list) {
    state.departmentList = list
  },
  SET_ROLE_LIST(state, list) {
    state.roleList = list
  },
  CLEAR_DEPARTMENT_LIST(state) {
    state.departmentList = []
  }
}

const actions = {
  // 获取用户列表
  async fetchUserList({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page: state.page.current,
        size: state.page.size,
        ...state.searchForm
      }
      const res = await getUserList(params)
      if (res.success) {
        commit('SET_USER_LIST', res.data || [])
        commit('SET_PAGE', { total: res.paginator?.total || 0 })
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return { success: false, message: '获取用户列表失败' }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 新增用户
  async addUser({ dispatch }, userData) {
    try {
      const res = await addUser(userData)
      if (res.success) {
        dispatch('fetchUserList')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      return { success: false, message: '新增用户失败' }
    }
  },

  // 编辑用户
  async updateUser({ dispatch }, { uuid, data }) {
    try {
      const res = await updateUser(uuid, data)
      if (res.success) {
        dispatch('fetchUserList')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      return { success: false, message: '更新用户失败' }
    }
  },

  // 删除用户
  async deleteUser({ dispatch }, id) {
    try {
      const res = await deleteUser(id)
      if (res.success) {
        dispatch('fetchUserList')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      return { success: false, message: '删除用户失败' }
    }
  },

  // 批量删除用户
  async batchDeleteUser({ dispatch }, ids) {
    try {
      const res = await batchDeleteUser(ids)
      if (res.success) {
        dispatch('fetchUserList')
        return { success: true }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      return { success: false, message: '批量删除失败' }
    }
  },

  // 更新搜索条件
  updateSearchForm({ commit, dispatch }, form) {
    commit('SET_SEARCH_FORM', form)
    commit('SET_PAGE', { current: 1 })
    dispatch('fetchUserList')
  },

  // 重置搜索条件
  resetSearch({ commit, dispatch }) {
    commit('RESET_SEARCH_FORM')
    dispatch('fetchUserList')
  },

  // 更新分页
  updatePage({ commit, dispatch }, page) {
    commit('SET_PAGE', page)
    dispatch('fetchUserList')
  },

  // 获取公司列表
  async fetchCompanyList({ commit }) {
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
    }
  },

  // 获取部门树形列表
  async fetchDepartmentTree({ commit }, companyUuid) {
    if (!companyUuid) {
      commit('CLEAR_DEPARTMENT_LIST')
      return { success: true, data: [] }
    }
    try {
      const res = await getDepartmentTree(companyUuid)
      if (res.success) {
        commit('SET_DEPARTMENT_LIST', res.data || [])
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取部门列表失败:', error)
      return { success: false, message: '获取部门列表失败' }
    }
  },

  // 获取角色列表
  async fetchRoleList({ commit }) {
    try {
      const res = await getRoleList()
      if (res.success) {
        commit('SET_ROLE_LIST', res.data || [])
        return { success: true, data: res.data }
      } else {
        return { success: false, message: res.message }
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      return { success: false, message: '获取角色列表失败' }
    }
  }
}

const getters = {
  userList: state => state.userList,
  loading: state => state.loading,
  page: state => state.page,
  searchForm: state => state.searchForm,
  companyList: state => state.companyList,
  departmentList: state => state.departmentList,
  roleList: state => state.roleList
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
