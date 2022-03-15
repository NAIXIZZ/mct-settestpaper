import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

// import home from '@/components/home.vue'
import login from '@/components/login.vue'
import outline from '@/components/outline/outline.vue'
import outline_second from '@/views/outline/topic/outline_second.vue'
import knowledge from '@/views/outline/topic/knowledge.vue'
import handout from '@/components/hand_out/hand_out.vue'
import checkQuesP from '@/components/hand_out/checkQuesP.vue'
import checkMaterial from '@/views/hand_out/material/checkMaterial.vue'
import ques_checkEdit from '@/views/hand_out/question/ques_checkEdit.vue'

Vue.use(VueRouter)
export default new Router({
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     redirect: '/home'
        // },
        // {
        //     path: '/home',
        //     name: 'home',
        //     component: home
        // }
        {
            path: '/',
            name: 'login',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/outline',
            name: 'outline',
            component: outline
        },
        {
            path: '/outline_second',
            name: 'outline_second',
            component: outline_second
        },
        {
            path: '/knowledge',
            name: 'knowledge',
            component: knowledge
        },
        {
            path: '/handout',
            name: 'handout',
            component: handout
        },
        {
            path: '/checkQuesP',
            name: 'checkQuesP',
            component: checkQuesP
        },
        {
            path: '/checkMaterial',
            name: 'checkMaterial',
            component: checkMaterial
        }
        ,
        {
            path: '/ques_checkEdit',
            name: 'ques_checkEdit',
            component: ques_checkEdit
        }
    ]
})