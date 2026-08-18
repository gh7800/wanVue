import request  from '../utils/request'

export function login(data) {
    return request({
        url: '/auth/login',  // 去掉开头的 /，让 baseURL 生效，然后代理重写
        loading: true,
        method: 'POST',
        data
    })
}

export function logout() {
    return request({
        url: '/auth/logout',
        method: 'POST'
    })
}

export function register(data) {
    return request({
        url: '/auth/register',
        method: 'POST',
        data
    })
}