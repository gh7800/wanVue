<template>
  <div class="main" style="height: 100vh">
    <el-container style="
        background: #f2f2f2;
        width: 100%;
        height: 100%;
        padding: 0;
        align-content: flex-start;
      " direction="horizontal">
      <el-aside display="block" style="width: auto; height: 100%; padding: 0; overflow-y: hidden"
        @mouseenter.native="handleOpen" @mouseleave.native="handleClose">
        <el-menu router background-color="#545c64" active-text-color="#ffd04b" text-color="#fff" :collapse="isCollapse"
          style="height: 100%; padding: 0,width = auto">
          <el-image :src="require('../assets/2.jpg')" style="width: auto; height: 75px; margin: 0" v-model="isCollapse">
          </el-image>
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
      <el-main style="background-color: white; padding: 0">
        <el-container class="el-container">
          <el-row style="background-color: gray; width: 100%; height: 75px" type="flex" justify="space-between">
            <el-row style="height: 100%" type="flex" align="middle" justify="start">
              <el-button @click="collapseStatus">
                <i class="el-icon-menu" style="padding:10px;"></i>
              </el-button>
              <span style="width: 130px">移动办公系统</span>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-between" align="middle">
              <el-row align="middle" justify="center" type="flex">
                <el-avatar :src="require('../assets/logo.png')" @click="avatarClick"></el-avatar>
                <span style="padding-right: 16px; padding-left: 10px; color: white">名称</span>
              </el-row>
            </el-row>
          </el-row>
        </el-container>
        <UserList></UserList>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import Hamburger from '@/components/Hamburger'
import UserList from "./UserList.vue";

export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    avatarClick() {
      this.$message.success("OK");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      true;
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
      false;
    },
    setHide() {
      isCollapse = !isCollapse;
    },
    collapseStatus() {
      this.collapseBtnClick = this.isCollapse;
      this.isCollapse = !this.isCollapse;
    },
  },
  comments: {
    // Hamburger
    UserList,
  },
};
</script>

<style scoped>

</style>
