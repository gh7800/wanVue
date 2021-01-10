import {login} from '../../api/user'
import { resetRouter } from '@/router'
import {getToken,setToken,setUserinfo} from '../../utils/auth'

const actions = {
    login({commit},userInfo) {

        const {username,password} = userInfo
        return new Promise((resolve,reject) => {

            login({username, password}).then(response => {
                const {data } = response
                //commit('SET_TOKEN',data.token)
                
                setToken(data.token)
                setUserinfo(data.userInfo)

                resolve(response)

            }).catch(error => {
                reject(error)
            })
        })

        // return new Promise((resolve, reject) => {
        //     login({ username: username.trim(), password: password }).then(response => {
        //         const { data } = response
        //         commit('SET_TOKEN', data.token) // name avatar permission abilities
        //         commit('SET_NAME', data.title)
        //         commit('SET_AVATAR', data.avatar_url)
        //         commit('SET_PERMISSION', data.permission)
        //         commit('SET_ABILITIES', data.abilities)
        //         commit('SET_USER', data)

        //         setUserinfo(data)
        //         setToken(data.token)
        //         resolve(response)
        //     }).catch(error => {
        //         reject(error)
        //     })
        // })
    },

    logout({commit}){

    }
}

export default {
    namespaced : true,
    actions
}
