import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import { getToken } from '../utils/auth'

Vue.use(VueRouter);

// 白名单路由（无需登录）
const whiteList = ['/']

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { title: '移动办公系统' },
        beforeEnter: (to, from, next) => {
            if (getToken()) {
                next('/home')
            } else {
                next()
            }
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/main',
        children: [
            {
                path: '/about',
                component: () => import('../views/About.vue')
            }, {
                path: '/main',
                component: () => import('../views/Main.vue')
            },
            {
                path:'/addUser',
                component: () => import('../views/addUser.vue')
            },
            {
                path : '/UserList',
                component : ()=> import('../views/UserList.vue')
            },
            {
                path: '/userManager',
                component: () => import('../views/system/userManager/UserManager.vue')
            },
            {
                path: '/departmentManager',
                component: () => import('../views/system/department/DepartmentManager.vue')
            },
            {
                path: '/roleManager',
                component: () => import('../views/system/role/RoleManager.vue')
            },
            {
                path: '/userInfo',
                component: () => import('../views/system/userInfo/UserInfo.vue')
            },
            {
                path: '/permissionManager',
                component: () => import('../views/system/permission/PermissionManager.vue')
            },
            {
                path: '/permissionGroup',
                component: () => import('../views/system/permissionGroup/PermissionGroupList.vue')
            },
            {
                path: '/permissionGroup/:type/:uuid?',
                component: () => import('../views/system/permissionGroup/PermissionGroupForm.vue')
            },
            {
                path: '/plateManager',
                component: () => import('../views/car/PlateManager.vue')
            },
            {
                path: '/myCar',
                component: () => import('../views/car/MyCar.vue')
            },
            {
                path: '/carApprove',
                component: () => import('../views/car/CarApprove.vue')
            },
            {
                path: '/carManage',
                component: () => import('../views/car/CarManage.vue')
            }
        ]
    },
    // 404 页面（必须放在最后）
    {
        path: '*',
        name: 'NotFound',
        component: () => import('../views/404.vue')
    }
];

const router = new VueRouter({
    routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题（优先使用 meta.title）
    document.title = to.meta.title || to.name || '移动办公系统'
    
    // 获取 token
    const hasToken = getToken()
    
    if (hasToken) {
        // 已登录
        if (to.path === '/') {
            // 已登录访问登录页，跳转到首页
            next('/home')
        } else {
            // 正常访问
            next()
        }
    } else {
        // 未登录
        if (whiteList.includes(to.path)) {
            // 白名单路由直接放行
            next()
        } else {
            // 非白名单路由，重定向到登录页
            next('/')
        }
    }
})

// 全局后置守卫
router.afterEach((to, from) => {
    // 可以在这里做页面统计、埋点等
    // console.log('路由切换完成:', to.path)
})

// 全局错误处理
router.onError((error) => {
    console.error('路由错误:', error)
})

export default router
