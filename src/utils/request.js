import axios from 'axios'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
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
        text: '努力请求中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
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
            duration: 60 * 1000
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
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })

    if (error.response.status === 401) {
      sessionStorage.clear()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
