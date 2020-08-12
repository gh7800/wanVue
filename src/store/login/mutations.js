export default {
    user(state,params){
        state.username = params.username;
        console.log(state.username)

        window.localStorage.setItem('token',params.token)
        window.localStorage.setItem('user',params.username)
    }
}
