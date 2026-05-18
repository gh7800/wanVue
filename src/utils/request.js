import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // 关闭 cookie，使用 token 认证
  timeout: 1000 * 60 // request timeout
})

function closeLoading(loading) {
  if (loading) {
    loading.close()
  }
}

// request interceptor
let loading
service.interceptors.request.use(
  config => {
    if (config.method !== 'get' && !config.loading) {
      loading = Loading.service({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.6)'
      })

    }
    // do something before request is sent
    const token = getToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // do something with request error
    closeLoading(loading)

    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob') {
      return response.data
    } else {
      const res = response.data
      console.log(res);
      closeLoading(loading)

      // if the custom code is not 20000, it is judged as an error.
      if (!res.success) {
        if (res.message === '无效的Ticket') {
          // 静默不提示
        } else {
          Message({
            message: res.message || 'Error',
            type: 'error',
            duration: 3 * 1000,
            showClose: true
          })
        }

        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        if (res.pagination) {
          res.pagination['current-page'] = res.pagination.current_page
        }
        return res
      }
    }
  },
  error => {
    // loading.close()
    closeLoading(loading)
    console.log('err' + error) // for debug
    
    // 优先显示后端返回的错误消息
    let errorMessage = error.message
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res.message) {
        errorMessage = res.message
      }
    }
    
    Message({
      message: errorMessage,
      type: 'error',
      duration: 3 * 1000,
      showClose: true
    })

    if (error.response) {
      const status = error.response.status
      
      if (status === 401) {
        // 未授权，清除登录信息并跳转登录页
        sessionStorage.clear()
        router.push('/')
        Message.error('登录已过期，请重新登录')
      } else if (status === 404) {
        // API 接口不存在
        Message.error('请求的资源不存在')
      } else if (status === 500) {
        // 服务器错误
        Message.error('服务器内部错误')
      } else if (status === 503) {
        // 服务不可用
        Message.error('服务暂时不可用')
      }
    }
    return Promise.reject(error)
  }
)

export default service
