<template>
    <div>
        <el-row style="height: 100%;">
            <el-col style="height: 100%;width: 20%;background-color: #324057;">
                <el-menu
                        router
                        :default-active="defaultActive">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-edit"></i>
                            <span>导航一</span>
                        </template>
                        <el-menu-item>项目1</el-menu-item>
                        <el-menu-item>项目2</el-menu-item>
                        <el-menu-item>项目3</el-menu-item>
                        <el-menu-item>项目4</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-magic-stick"></i>
                            <span>导航二</span>
                        </template>
                        <el-menu-item index="about">关于</el-menu-item>
                        <el-menu-item index="main">home</el-menu-item>
                        <el-menu-item>首页的</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航三</span>
                        </template>
                        <el-menu-item>项目5</el-menu-item>
                        <el-menu-item>项目6</el-menu-item>
                        <el-menu-item>项目7</el-menu-item>
                        <el-menu-item>项目8</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
            <el-col style="height: 100%;width:80%; overflow: auto;">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        computed: {
            defaultActive: function () {
                return this.$route.path.replace('/', '');
            }
        },
        name: "Home",
    }
</script>

<style scoped>

</style>
