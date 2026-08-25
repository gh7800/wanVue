import { login, logout, register } from '../../api/user'
import { resetRouter } from '@/router'
import { getToken, setToken, setUserinfo, removeToken, cleanUserInfo } from '../../utils/auth'

const actions = {
    login({ commit }, userInfo) {

        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username, password })
                .then(response => {
                    const { data } = response
                    //commit('SET_TOKEN',data.token)

                    setToken(data.token)
                    setUserinfo(data)

                    resolve(response)

                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // 注册：仅调用接口，不自动登录（成功后由页面跳转回登录）
    register({ commit }, userInfo) {
        const { username, password, phone, email } = userInfo
        return new Promise((resolve, reject) => {
            register({ username, password, phone, email })
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    logout({ commit }) {
        return new Promise((resolve) => {
            logout()
                .then(() => {
                    cleanUserInfo()
                    resolve()
                })
                .catch(() => {
                    // 后端登出接口失败（认证错误/Token 过期/网络异常）时，
                    // 仍强制清除本地登录态并正常返回，让页面直接退到登录页，
                    // 避免用户被卡在系统里退不出去
                    cleanUserInfo()
                    resolve()
                })
        })
    }
}

export default {
    namespaced: true,
    actions
}
