import request  from '../utils/request'

export function login(data) {
    return request({
        url: 'auth/login',
        loading:true,
        method: 'POST',
        data
    })
    // return request({
    //     url: 'api/login',
    //     loading: true,
    //     method: 'post',
    //     data
    // })
}