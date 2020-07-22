<template>
  <div style="align-items: center">
    <el-image :src="url" />
    <br/>
    <el-input v-model="username" placeholder="请输入账号.." clearable />
    <br/>
    <el-input v-model="password" placeholder="请输入密码.." align="center" show-password/>
    <br/>
    <el-button type="primary" v-on:click="login">登 录</el-button>
  </div>
</template>

<script>
  import {logins} from '@/api/getData'

  export default {
    name: "Login",
    data() {
      return {
        username: '',
        password: '',
        url: require("../assets/logo.png")
      }
    },
    methods: {
      async login () {
        console.log(this.username, this.password);
        const res = await logins({user_name:this.username, password:this.password});
        console.log("res---------"+res)
      }
    }
  }
</script>

<style scoped>
  .el-image{
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
