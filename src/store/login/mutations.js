export default {
    user(state,params){
        //console.log(params)
        window.localStorage.setItem('token',params.token)
        window.localStorage.setItem('user',params)
    }
}
