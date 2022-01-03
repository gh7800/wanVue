import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home'
import Login from '../pages/Login'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
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

    /*{
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
    }*/

];

const router = new VueRouter({
    routes
});

export default router
