import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

import home from '@/components/home.vue'

Vue.use(VueRouter)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'home',
            component: home
        }
    ]
})