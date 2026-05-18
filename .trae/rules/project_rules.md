# 项目规则

## 包管理工具
- 使用 **yarn** 管理项目依赖
- 不使用 npm

### 常用命令
```bash
yarn install    # 安装依赖
yarn dev        # 启动开发服务器
yarn build      # 构建项目
yarn lint       # 运行 ESLint
```

## 技术栈
- Vue 2.6
- Vue Router 3
- Vuex 3
- Element UI 2.15
- Axios
- SCSS

## 架构模式
- 使用 **MVVM（Model-View-ViewModel）** 框架开发
- View 层：负责 UI 渲染（src/views/）
- ViewModel 层：管理状态和业务逻辑（src/store/）
- Model 层：封装 API 接口（src/api/）

## 状态管理
- 使用 Vuex（src/store/）
- 不使用 Pinia
- 状态按模块划分（src/store/module/）
- 使用 mutations 修改状态
- 使用 actions 处理异步操作
- 使用 getters 派生状态

## 目录结构
```
src/
├── api/          # API 接口层（Model）
├── components/   # 公共组件
├── views/        # 页面视图（View）
├── store/        # Vuex 状态管理（ViewModel）
├── router/       # 路由配置
├── utils/        # 工具函数
├── config/       # 配置文件
└── scss/         # 全局样式
```

## 路由管理
- 使用 Vue Router 进行路由配置
- 路由采用懒加载模式
- 白名单路由无需登录即可访问
- 路由命名采用 PascalCase 格式

## API 请求
- 使用 Axios 封装请求（src/utils/request.js）
- API 接口统一存放在 src/api/ 目录
- 请求头自动携带 Authorization Token
- 响应数据统一格式：{ success, message, data, pagination }

## 代码风格
- 使用 ESLint 进行代码检查
- 变量命名采用 camelCase
- 组件命名采用 PascalCase
- 函数命名采用 camelCase
- 文件命名采用 kebab-case
- 缩进使用 2 空格

## 组件开发
- 公共组件放在 src/components/
- 页面组件放在 src/views/
- 组件属性使用 props 定义
- 事件使用 $emit 触发
- 避免直接操作 DOM
