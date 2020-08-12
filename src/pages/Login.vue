<template>
    <div id="main">
        <!--<el-image :src="require('../assets/logo.png')" />-->
        <br/>
        <el-input v-model="username" placeholder="请输入账号.." clearable/>
        <br/>
        <el-input v-model="password" placeholder="请输入密码.." align="center" show-password/>
        <br/>
        <el-button type="primary" v-on:click="login">登 录</el-button>
    </div>
</template>

<script>
    //import {login} from '../api/getData'

    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: '',
            }
        },
        methods: {
            login() {
                this.$store.dispatch('login', {username: this.username, password: this.password})
                    .then(async res => {
                        console.log(res)
                        this.$message.success('登录成功')
                        if (res.success) {
                            await this.$router.push({name: 'Home'})
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            /*async login () {
              const res = await login({username:this.username, password:this.password});
              //const result = await banner();

              console.log("res---------"+res.data.toString());
              if(res.success){
                this.$router.push({name:'Home'})
              }
            }*/
        }
    }
</script>

<style scoped>
    #main {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 600px;
        height: 400px;
        margin-left: -300px;
        margin-top: -200px;
    }

    .el-image {
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
    }

    .el-input {
        width: 300px;
        margin-bottom: 20px;
    }

    .el-button {
        width: 300px;
    }
</style>
