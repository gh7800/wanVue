<template>
    <div class="main" style="height:100vh;">
        <el-container style="background: #f2f2f2;width: 100%; height: 100%;padding: 0;align-content: flex-start;"
                      direction="horizontal">
            <el-aside display="block" style="width: 13%;height:100%;padding: 0;overflow-y: hidden;">
                <el-image :src="require('../assets/2.jpg')" style="width: 100%;height: 75px;"></el-image>
                <el-menu
                        router
                        background-color="#545c64"
                        active-text-color="#ffd04b"
                        text-color="#fff"
                        style="height:100%;padding: 0">
                    <el-submenu index="1">
                        <template slot="title" style="padding: 0">
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
            <el-main style="background-color: white;padding: 0">
                <el-container class="el-container" style="background-color: gray;padding: 0;" direction="horizontal">
                    <i class="el-icon-menu" style="height: 30px;width: 30px;"></i>
                    <span >移动办公系统</span>
                    <el-col >
                        <el-image :src="require('../assets/logo.png')" style="width: 60px;height: 60px;"></el-image>
                        <span>切换账号</span>
                    </el-col>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    // import Hamburger from '@/components/Hamburger'
    export default {
        computed: {
            defaultActive: function () {
                return this.$route.path.replace("/", "")
            },
        },
        name: "Home",
        comments: {
            // Hamburger
        },
    }
</script>

<style scoped>

</style>
