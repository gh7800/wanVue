<template>
        <div style="height:100%;" class="login-container">
        <div>
            <!-- <el-image :src="require('../../assets/2.jpg')" style="width:100%;height:100vh;"/> -->
        </div>

        <div id="main">
            <el-image :src="require('../assets/icon_logo.png')" class="logo-image"/>    
            <div class="login-title">移动办公系统登录</div>
            <el-form :model="loginForm">
                <el-form-item>
                    <el-col>
                        <el-input v-model="loginForm.username" placeholder="请输入账号.." clearable/>
                        <br/>
                        <el-input v-model="loginForm.password" placeholder="请输入密码.." align="center" show-password/>
                    </el-col>
                    <el-button :loading="this.loading" type="primary" v-on:click="login">登 录</el-button>
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
                loading: false
            }
        },
        methods: {
            login() {
                if (!this.loginForm.username.trim()) {
                    this.$message.warning('请输入账号')
                    return
                }
                if (!this.loginForm.password.trim()) {
                    this.$message.warning('请输入密码')
                    return
                }
                this.loading = true
                this.$store.dispatch('login/login', this.loginForm)
                    .then(res => {
                        this.loading = false
                        //console.log(res)

                        if (res.success) {
                            this.$message.success('登录成功')
                            //const name = this.$store.getters.getUser
                            //console.log("----" + name)
                            this.$router.replace('/home')
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                    .catch(error => {
                        this.loading = false
                        console.log(error)
                    })
            }
        }
    }
</script>

<style scoped>
    .login-container {
        background: linear-gradient(135deg, #fff 0%, #5482EE 100%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .main {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 600px;
        height: 400px;
        margin-left: -300px;
        margin-top: -200px;
    }

    .el-image {
        width: 85px;
        height: 85px;
        margin-bottom: 50px;

    }

    .el-form {
        text-align: center;
    }

    .el-input {
        width: 350px;
        height: 40px;
        margin-bottom: 20px;
    }

    .el-button {
        width: 350px;
    }
    .logo-image {
        width: 85px;
        height: 85px;
        margin: 0 auto 20px;
        display: block;
        margin-bottom: 30px;
    }

    .login-title {
        font-size: 20px;
        color: #fff;
        text-align: center;
        margin-bottom: 30px;
        font-weight: 500;
        letter-spacing: 2px;
    }
</style>
