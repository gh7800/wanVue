<template>
  <div class="main" style="height: 100vh">
    <el-container style="
        background: #f2f2f2;
        width: 100%;
        height: 100%;
        padding: 0;
        align-content: flex-start;
      " direction="horizontal">
      <el-aside display="block" :style="{ width: isCollapse ? '64px' : '200px', height: '100%', padding: 0, overflow: 'hidden' }"
        @mouseenter.native="handleOpen" @mouseleave.native="handleClose">
        <el-menu router 
          background-color="#1a1f2e" 
          active-text-color="#5482EE" 
          text-color="#b8c5d6" 
          :collapse="isCollapse"
          style="height: 100%; border-right: none;"
          class="custom-menu">
          <div class="logo-container">
            <el-image :src="require('../assets/icon_logo.png')" class="logo-image" v-model="isCollapse">
            </el-image>
          </div>
          <el-menu-item index="main">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
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
            <el-menu-item index="plateManager">车牌管理</el-menu-item>
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
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="userManager">用户管理</el-menu-item>
            <el-menu-item index="departmentManager">部门管理</el-menu-item>
            <el-menu-item index="roleManager">角色管理</el-menu-item>
            <el-menu-item index="permissionManager">权限字典</el-menu-item>
            <el-menu-item index="permissionGroup">权限群组</el-menu-item>
            <el-menu-item index="userInfo">个人信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="background-color: white; padding: 0">
        <el-container class="el-container">
          <el-row style="background-color: #fff; width: 100%; height: 75px; border-bottom: 1px solid #e8e8e8" type="flex" justify="space-between">
            <el-row style="height: 100%" type="flex" align="middle" justify="start">
              <el-button @click="collapseStatus" class="collapse-btn" title="收起/展开菜单">
                <i class="el-icon-s-fold"></i>
              </el-button>
              <span style="width: 130px; font-size: 16px; font-weight: bold; color: #333; margin-left: 10px;">移动办公系统</span>
            </el-row>
            <el-row type="flex" class="header-right" justify="space-between" align="middle">
              <el-row class="header-actions" align="middle" justify="center" type="flex">
                <el-button class="header-btn" @click="toggleFullscreen" title="全屏">
                  <i class="el-icon-full-screen"></i>
                </el-button>
                <el-button class="header-btn" @click="refreshPage" title="刷新">
                  <i class="el-icon-refresh"></i>
                </el-button>
                <div class="user-info">
                  <el-avatar :src="require('../assets/icon_logo.png')" class="user-avatar" @click="avatarClick"></el-avatar>
                  <span class="user-name">{{ userName }}</span>
                  <el-dropdown class="user-dropdown" @command="handleCommand">
                    <i class="el-icon-arrow-down dropdown-icon"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                      <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-row>
            </el-row>
          </el-row>
        </el-container>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import Hamburger from '@/components/Hamburger'

import { getUserInfo } from '../utils/auth'

export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    userName() {
      const info = getUserInfo()
      return info.real_name || info.username || '用户1'
    }
  },
  methods: {
    avatarClick() {
      this.$router.push('/userInfo')
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
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    refreshPage() {
      location.reload();
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('login/logout').then(() => {
            this.$message.success('退出成功')
            this.$router.push('/')
          }).catch(() => {
            this.$message.error('退出失败')
          })
        }).catch(() => {})
      } else if (command === 'profile') {
        this.$router.push('/userInfo')
      }
    }
  },
  comments: {
    // Hamburger
  },
};
</script>

<style>
.el-menu--collapse .el-submenu__icon-arrow {
  display: block;
  right: 4px;
}
.el-menu--collapse .el-menu-item i,
.el-menu--collapse .el-submenu__title i {
  margin-left: 0;
}
.el-menu-item,
.el-submenu__title {
  text-align: left !important;
}
.el-aside {
  transition: width 0.3s;
}
.collapse-btn {
  border: none;
  background: transparent;
  color: #8a9ab0;
  font-size: 16px;
  padding: 0;
  width: 30px;
  height: 30px;
  margin-left: 10px !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(84, 130, 238, 0.1);
  color: #5482EE;
  transform: translateY(-1px);
}

.header-right {
  padding-right: 20px;
}

.header-actions {
  gap: 8px;
}

.header-btn {
  border: none;
  background: transparent;
  color: #8a9ab0;
  font-size: 16px;
  padding: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

.header-btn:hover {
  background: rgba(84, 130, 238, 0.1);
  color: #5482EE;
  transform: translateY(-1px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 12px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border: 1px solid #e8eaf6;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(84, 130, 238, 0.08);
  transition: all 0.3s ease;
}

.user-info:hover {
  box-shadow: 0 4px 12px rgba(84, 130, 238, 0.15);
  border-color: #d9e2f7;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1f2e;
}

.user-dropdown {
  cursor: pointer;
}

.dropdown-icon {
  color: #8a9ab0;
  font-size: 12px;
  transition: all 0.3s ease;
}

.user-info:hover .dropdown-icon {
  color: #5482EE;
  transform: rotate(180deg);
}

/* Logo 容器样式 */
.logo-container {
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: linear-gradient(135deg, #1a1f2e 0%, #252b3d 100%);
  border-bottom: 1px solid rgba(84, 130, 238, 0.1);
  overflow: hidden;
}

.logo-image {
  width: auto;
  height: 55px;
}

/* 自定义菜单样式 */
.custom-menu {
  background-color: #1a1f2e !important;
}

.custom-menu .el-menu-item,
.custom-menu .el-submenu__title {
  color: #b8c5d6 !important;
  background-color: transparent !important;
  font-weight: 500;
}

.custom-menu .el-menu-item:hover,
.custom-menu .el-submenu__title:hover {
  background-color: rgba(84, 130, 238, 0.15) !important;
  color: #fff !important;
}

.custom-menu .el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(84, 130, 238, 0.25) 0%, rgba(84, 130, 238, 0.05) 100%) !important;
  color: #5482EE !important;
  border-left: 3px solid #5482EE;
}

.custom-menu .el-menu-item.is-active i {
  color: #5482EE !important;
}

.custom-menu .el-submenu.is-active .el-submenu__title {
  color: #5482EE !important;
}

.custom-menu .el-submenu.is-active .el-submenu__title i {
  color: #5482EE !important;
}

.custom-menu i {
  color: #8a9ab0 !important;
  margin-right: 10px;
}

.custom-menu .el-menu-item:hover i,
.custom-menu .el-submenu__title:hover i {
  color: #fff !important;
}

/* 子菜单样式 */
.custom-menu .el-menu--inline {
  background-color: #141824 !important;
}

.custom-menu .el-menu--inline .el-menu-item {
  background-color: transparent !important;
  color: #8a9ab0 !important;
}

.custom-menu .el-menu--inline .el-menu-item:hover {
  background-color: rgba(84, 130, 238, 0.1) !important;
  color: #fff !important;
}

.custom-menu .el-menu--inline .el-menu-item.is-active {
  background: linear-gradient(90deg, rgba(84, 130, 238, 0.2) 0%, transparent 100%) !important;
  color: #5482EE !important;
  border-left: 3px solid #5482EE;
}
</style>
