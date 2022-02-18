import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

// import home from '@/components/home.vue'
import login from '@/components/login.vue'
import outline from '@/components/outline/outline.vue'
import doc_doc from '@/components/outline/topic/doc_doc.vue'
import doc_nur from '@/components/outline/topic/doc_nur.vue'
import doc_pat from '@/components/outline/topic/doc_pat.vue'
import pat_nur from '@/components/outline/topic/pat_nur.vue'
import knowledge from '@/components/outline/topic/knowledge.vue'
import handout from '@/components/hand_out/hand_out.vue'

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
        }
    ]
})