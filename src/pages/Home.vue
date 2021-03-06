<template>
  <div class="main" style="height:100vh;">
    <el-header style="height: 76px">
      <span style="backgroudColor:red">移动办公</span>
    </el-header>
    <el-container style="background: #f2f2f2; height: 100%">
      <el-aside width="13%" display="block" position="absolute" overfolw-y="scroll" >
        <el-menu
          router
          background-color="#545c64"
          active-text-color="#ffd04b"
          text-color="#fff"
          style="height:100%"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>公文管理</span>
            </template>
            <el-menu-item index="addUser">我的请示</el-menu-item>
            <el-menu-item index="UserList">收文管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-magic-stick"></i>
              <span>用车管理</span>
            </template>
            <el-menu-item index="about">我的用车</el-menu-item>
            <el-menu-item index="main">用车审批</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>会议管理</span>
            </template>
            <el-menu-item>我的会议</el-menu-item>
            <el-menu-item>会议审批</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>资产管理</span>
            </template>
            <el-menu-item>固定资产</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>通知管理</span>
            </template>
            <el-menu-item>收到通知</el-menu-item>
            <el-menu-item>发送通知</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-edit"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item>用户管理</el-menu-item>
            <el-menu-item>App管理</el-menu-item>
            <el-menu-item>角色权限管理</el-menu-item>
            <el-menu-item>个人信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main> </el-main>
    </el-container>
  </div>
</template>

<script>
// import Hamburger from '@/components/Hamburger'
export default {
  computed: {
    defaultActive: function () {
      return this.$route.path.replace("/", "");
    },
  },
  name: "Home",
  comments: {
    // Hamburger
  },
};
</script>

<style scoped>
</style>
