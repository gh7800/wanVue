<template>
    <div style="height:100%;" class="login-container">
        <div id="main">
            <el-image :src="require('../assets/icon_logo.png')" class="logo-image"/>
            <div class="login-title">移动办公系统{{ mode === 'login' ? '登录' : '注册' }}</div>

            <!-- 登录 -->
            <el-form v-if="mode === 'login'" :model="loginForm">
                <el-form-item>
                    <el-col>
                        <el-input v-model="loginForm.username" placeholder="请输入账号.." clearable/>
                        <br/>
                        <el-input v-model="loginForm.password" placeholder="请输入密码.." show-password/>
                    </el-col>
                    <el-button :loading="loading" type="primary" @click="login">登 录</el-button>
                    <div class="switch-tip">还没有账号？<span class="link" @click="switchMode('register')">立即注册</span></div>
                </el-form-item>
            </el-form>

            <!-- 注册 -->
            <el-form v-else :model="registerForm">
                <el-form-item>
                    <el-col>
                        <el-input v-model="registerForm.username" placeholder="请输入账号(4-16位字母数字).." clearable/>
                        <br/>
                        <el-input v-model="registerForm.password" placeholder="请输入密码(4-16位字母数字).." show-password/>
                        <br/>
                        <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码.." show-password/>
                        <br/>
                        <el-input v-model="registerForm.phone" placeholder="手机号(选填).." clearable/>
                        <br/>
                        <el-input v-model="registerForm.email" placeholder="邮箱(选填).." clearable/>
                    </el-col>
                    <el-button :loading="loading" type="primary" @click="register">注 册</el-button>
                    <div class="switch-tip">已有账号？<span class="link" @click="switchMode('login')">返回登录</span></div>
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
                mode: 'login',
                loginForm: {
                    username: '',
                    password: ''
                },
                registerForm: {
                    username: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    email: ''
                },
                loading: false
            }
        },
        methods: {
            switchMode(mode) {
                this.mode = mode
                this.loading = false
            },
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
            },
            register() {
                const form = this.registerForm
                if (!form.username.trim()) {
                    this.$message.warning('请输入账号')
                    return
                }
                if (!form.password.trim()) {
                    this.$message.warning('请输入密码')
                    return
                }
                if (form.password !== form.confirmPassword) {
                    this.$message.warning('两次输入的密码不一致')
                    return
                }

                this.loading = true
                const payload = {
                    username: form.username.trim(),
                    password: form.password
                }
                if (form.phone.trim()) payload.phone = form.phone.trim()
                if (form.email.trim()) payload.email = form.email.trim()

                this.$store.dispatch('login/register', payload)
                    .then(res => {
                        this.loading = false
                        if (res.success) {
                            this.$message.success('注册成功，请登录')
                            // 返回登录页，并预填账号，让用户手动登录
                            this.loginForm.username = form.username.trim()
                            this.registerForm = { username: '', password: '', confirmPassword: '', phone: '', email: '' }
                            this.mode = 'login'
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                    .catch(() => {
                        this.loading = false
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

    .switch-tip {
        text-align: center;
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
    }
    .switch-tip .link {
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 3px;
    }
    .switch-tip .link:hover {
        opacity: 0.85;
    }
</style>
