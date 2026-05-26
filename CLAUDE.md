# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 2 企业内部办公自动化系统（OA），功能模块包括公文管理、用车管理、会议管理、资产管理、通知管理、系统设置。

## Commands

```bash
# 安装依赖
yarn install

# 启动开发服务器 (localhost:8080)
yarn dev

# 生产构建
yarn build

# 代码检查
yarn lint

# 清除缓存
yarn clear
```

所有 dev/build 命令需要 `NODE_OPTIONS=--openssl-legacy-provider`（兼容 Node 17+）。

## Tech Stack

- **Vue 2** (2.6.11) + Vue Router 3 + Vuex 3
- **Element UI** (2.15.1) 组件库
- **Axios** (0.20.0) HTTP 客户端
- **Vue CLI 4** (@vue/cli-service ~4.4.0)

## Architecture

```
src/
├── main.js                  # 入口，挂载 Vue、Element UI、Router、Vuex
├── App.vue                  # 根组件，仅包含 <router-view>
├── router/index.js          # 路由配置（hash 模式）
├── store/
│   ├── index.js             # Vuex 根 store
│   └── module/login.js      # 登录模块 actions
├── api/
│   ├── user.js              # 登录 API（基于 utils/request.js）
│   └── getData.js           # 遗留 API（基于 config/fetch.js）
├── utils/
│   ├── request.js           # Axios 实例 + 请求/响应拦截器
│   ├── auth.js              # Token/用户信息 sessionStorage 读写
│   └── colors.js            # 颜色工具
├── config/
│   ├── env.js               # 环境配置（baseUrl/routerMode）
│   └── fetch.js             # 遗留 fetch/XMLHttpRequest 封装
├── views/                   # 页面（懒加载）
│   ├── About.vue
│   ├── Main.vue
│   ├── Login.vue            # 登录页（根路由 "/"）
│   ├── Home.vue             # 主布局（侧边栏 + 顶栏 + 内容区）
│   ├── UserList.vue         # 用户列表
│   ├── addUser.vue          # 新增用户（占位）
│   └── Test.vue
└── components/              # 公共组件
    └── HelloWorld.vue
```

## Key Patterns

### 路由结构
- `/` → Login（登录页）
- `/home` → Home（主布局，嵌套子路由 `/about`, `/main`, `/addUser`, `/UserList`）

### 认证流程
1. Login 页面调用 `this.$store.dispatch('login/login', form)`
2. Vuex action `login/login` 调用 `api/user.js` → `utils/request.js`（Axios）
3. 登录成功后 token 和 userInfo 通过 `utils/auth.js` 存入 `sessionStorage`
4. Axios 请求拦截器从 sessionStorage 取出 token 注入 `Authorization: Bearer <token>` 请求头
5. 响应拦截器：`res.success === false` 时显示错误提示；401 时清空 sessionStorage 并跳转回 `/login`

### HTTP 客户端
- **主要：** `utils/request.js` — Axios 实例，带 loading 动画、token 注入、统一错误处理
- **遗留：** `config/fetch.js` — 原生 fetch + XMLHttpRequest 封装（`api/getData.js` 仍在使用）

### 后端代理
开发服务器将所有 `/auth` 和 `/api` 请求代理到 `http://localhost:8000`（在 `vue.config.js` 中配置）。

### 环境变量
- `.env.development` — `VUE_APP_BASE_API = ''`（通过代理走同域）
- `.env.production` — `VUE_APP_BASE_API = ''`

### design设计文档
- 页面大小尽量适配不同屏幕尺寸
- 组件库选择 Element UI
- 其他设计考虑：响应式布局、用户交互、视觉一致性等
- 页面布局：采用侧边栏 + 顶栏 + 内容区布局
- 页面拉伸：内容区根据屏幕尺寸自适应拉伸，避免内容被遮挡
