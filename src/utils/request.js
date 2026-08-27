import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { getToken, cleanUserInfo } from '@/utils/auth'
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
        // 业务层认证失败（如无效的Ticket）：命中关键字则强制退出登录
        const authFailMessages = ['无效的Token', 'Token已过期', '未授权', '请先登录', '登录已过期', '无效的Ticket', 'Unauthenticated']
        if (authFailMessages.some(k => res.message && res.message.indexOf(k) !== -1)) {
          cleanUserInfo()
          router.push('/')
          Message.error(res.message || '登录已过期，请重新登录')
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
        if (res.paginator) {
          res.paginator['current-page'] = res.paginator.current
        }
        return res
      }
    }
  },
  error => {
    // loading.close()
    closeLoading(loading)
    console.log('err' + error) // for debug

    let errorMessage = error.message
    if (error.response && error.response.data) {
      const res = error.response.data
      if (res.message) {
        errorMessage = res.message
      }
    }

    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        // 未授权/认证失效：清除登录态并跳转登录页（已持久化到 localStorage 的 token 一并清除）
        cleanUserInfo()
        router.push('/')
        Message.error('登录已过期，请重新登录')
        return Promise.reject(error)
      } else if (status === 404) {
        // API 接口不存在
        Message.error('请求的资源不存在')
        return Promise.reject(error)
      } else if (status === 500) {
        // 服务器错误
        Message.error('服务器内部错误')
        return Promise.reject(error)
      } else if (status === 503) {
        // 服务不可用
        Message.error('服务暂时不可用')
        return Promise.reject(error)
      }
      // 403 等其它状态码：已登录但无权限，仅提示，不退出登录
    }

    Message({
      message: errorMessage,
      type: 'error',
      duration: 3 * 1000,
      showClose: true
    })
    return Promise.reject(error)
  }
)

export default service
