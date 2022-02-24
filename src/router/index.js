import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

// import home from '@/components/home.vue'
import login from '@/components/login.vue'
import outline from '@/components/outline/outline.vue'
import doc_doc from '@/views/outline/topic/doc_doc.vue'
import doc_nur from '@/views/outline/topic/doc_nur.vue'
import doc_pat from '@/views/outline/topic/doc_pat.vue'
import pat_nur from '@/views/outline/topic/pat_nur.vue'
import knowledge from '@/views/outline/topic/knowledge.vue'
import handout from '@/components/hand_out/hand_out.vue'
import checkQuesP from '@/components/hand_out/checkQuesP.vue'
import checkMaterial from '@/views/hand_out/material/checkMaterial.vue'

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
            name: 'outline',
            redirect: '/outline'
        },
        {
            path: '/outline',
            name: 'outline',
            component: outline
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/doc_doc',
            name: 'doc_doc',
            component: doc_doc
        },
        {
            path: '/doc_nur',
            name: 'doc_nur',
            component: doc_nur
        },
        {
            path: '/doc_pat',
            name: 'doc_pat',
            component: doc_pat
        },
        {
            path: '/pat_nur',
            name: 'pat_nur',
            component: pat_nur
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
    ]
})