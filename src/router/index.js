import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { getToken } from '../utils/auth'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
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
                component: () => import('../views/HelloWord.vue')
            },
            {
                path:'/addUser',
                component: () => import('../pages/addUser')
            },
            {
                path : '/UserList',
                component : ()=> import('../pages/UserList')
            }
        ]
    },

];

const router = new VueRouter({
    routes
});

export default router
