<template>
<div>
    <div>
        <el-image :src="require('../assets/2.jpg')" style="width:100%;height:100%"/>
    </div>
    <div id="main" >
        <!-- <el-image :src="require('../assets/logo.png')" /> -->
        <el-form :model="loginForm" >
            <el-form-item>
                <el-col >
                    <el-input v-model="loginForm.username" placeholder="请输入账号.." clearable/>
                <br/>
                    <el-input v-model="loginForm.password" placeholder="请输入密码.." align="center" show-password/>
                </el-col>
                <el-button :loading='loading' type="primary" v-on:click="login">登 录</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loading : false
            }
        },
        methods: {
            login() {
                this.loading = false
                this.$store.dispatch('login/login', this.loginForm)
                    .then( res => {
                        this.loading = true
                        console.log(res)
                        if (res.success) {
                            this.$message.success('登录成功')
                            const name = this.$store.getters.getUser
                            console.log("----" + name)
                             this.$router.replace('Home')
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
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
