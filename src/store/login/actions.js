import {login} from '../../api/getData'

export default {
    async login(context, {username, password}) {
        //console.log(username,password,'tag')
        const res = await login({username, password})
        if (res.success) {
            this.commit('user', res.data)
        }
        return res
    }
}
