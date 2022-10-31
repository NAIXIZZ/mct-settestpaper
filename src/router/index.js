import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

import login from '@/components/login.vue'
import outline from '@/components/outline/outline.vue'
import outline_second from '@/views/outline/topic/outline_second.vue'
import knowledge from '@/views/outline/topic/knowledge.vue'
import makeout from '@/components/make_out/make_out.vue'
import checkQuesP from '@/components/make_out/checkQuesP.vue'
import checkMaterial from '@/views/make_out/material/checkMaterial.vue'
import materialCatalog from '@/views/make_out/material/materialCatalog.vue'
import questionCatalog from '@/views/make_out/question/questionCatalog.vue'
import paperCatalog from '@/views/make_out/paper/paperCatalog.vue'
import ques_checkEdit from '@/views/make_out/question/ques_checkEdit.vue'
import addQuestion from '@/views/make_out/question/addQuestion.vue'
// import autoQues from '@/views/make_out/question/autoQues.vue'
// import paper from '@/components/paperDetail.vue'
import mcreatePaper from '@/views/make_out/paper/mcreatePaper.vue'
import home from '@/views/home.vue'
import visitor from '@/views/visitor/visitor.vue'
import visitor_kg from '@/views/visitor//kg/visitor_kg.vue'
import visitor_kg_show from '@/views/visitor//kg/visitor_kg_show.vue'
import visitor_outline from '@/views/visitor/outline/visitor_outline.vue'
import kg from '@/views/kg/kg.vue'
import statistic_analysis from '@/views/statistic_analysis/statistic_analysis.vue'
import hand_out from '@/views/hand_out/hand_out.vue'
import paperDetail from '@/components/paperDetail.vue'
import visitor_paperDetail from '@/components/visitor_paperDetail.vue'
// import detailAnalysis from '@/views/statistic_analysis/components/detailAnalysis.vue'
import qtopic_outline from '@/views/make_out/question/qoutline/qtopic_outline.vue'
import qtask_outline from '@/views/make_out/question/qoutline/qtask_outline.vue'
import qoutline_select from '@/views/make_out/question/qoutline/qoutline_select.vue'
import qknowledge from '@/views/make_out/question/qoutline/qknowledge.vue'
import qgrade_standard from '@/views/make_out/question/qoutline/qgrade_standard.vue'
import selectQues from '@/views/make_out/paper/selectQues.vue'
import wordKg from '@/views/outline/vocabulary/wordKg.vue'
import visitor_wordKg from '@/views/visitor/outline/visitor_wordKg.vue'
import kgShow from '@/views/kg/kgShow.vue'
import selectEnterCatalog from '@/views/make_out/paper/selectEnterCatalog.vue'
import preview from '@/views/make_out/paper/preview.vue'
import trash_list from '@/views/make_out/trash/trash_list.vue'

Vue.use(VueRouter)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'visitor',
            redirect: '/visitor'
        },
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/visitor',
            name: 'visitor',
            component: visitor
        },
        {
            path: '/visitor_kg',
            name: 'visitor_kg',
            component: visitor_kg
        },
        {
            path: '/visitor_kg_show',
            name: 'visitor_kg_show',
            component: visitor_kg_show
        },
        {
            path: '/visitor_outline',
            name: 'visitor_outline',
            component: visitor_outline
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
            path: '/makeout',
            name: 'makeout',
            component: makeout
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
        },
        {
            path: '/materialCatalog',
            name: 'materialCatalog',
            component: materialCatalog
        },
        {
            path: '/questionCatalog',
            name: 'questionCatalog',
            component: questionCatalog
        },
        {
            path: '/paperCatalog',
            name: 'paperCatalog',
            component: paperCatalog
        },
        {
            path: '/ques_checkEdit',
            name: 'ques_checkEdit',
            component: ques_checkEdit
        },
        {
            path: '/addQuestion',
            name: 'addQuestion',
            component: addQuestion
        },
        // {
        //     path: '/autoQues',
        //     name: 'autoQues',
        //     component: autoQues
        // },
        {
            path: '/mcreatePaper',
            name: 'mcreatePaper',
            component: mcreatePaper,
            meta:{
                keepAlive: true
            }
        },
        {
            path: '/selectQues',
            name: 'selectQues',
            component: selectQues
        },
        {
            path: '/kg',
            name: 'kg',
            component: kg
        },
        {
            path: '/statistic_analysis',
            name: 'statistic_analysis',
            component: statistic_analysis
        },
        {
            path: '/hand_out',
            name: 'hand_out',
            component: hand_out
        },
        {
            path: '/paperDetail',
            name: 'paperDetail',
            component: paperDetail
        },
        {
            path: '/visitor_paperDetail',
            name: 'visitor_paperDetail',
            component: visitor_paperDetail
        },
        // {
        //     path: '/detailAnalysis',
        //     name: 'detailAnalysis',
        //     component: detailAnalysis
        // },
        {
            path: '/qtopic_outline',
            name: 'qtopic_outline',
            component: qtopic_outline
        },
        {
            path: '/qtask_outline',
            name: 'qtask_outline',
            component: qtask_outline
        },
        {
            path: '/qoutline_select',
            name: 'qoutline_select',
            component: qoutline_select
        },
        {
            path: '/qknowledge',
            name: 'qknowledge',
            component: qknowledge
        },
        {
            path: '/qgrade_standard',
            name: 'qgrade_standard',
            component: qgrade_standard
        },
        {
            path: '/wordKg',
            name: 'wordKg',
            component: wordKg
        },
        {
            path: '/kgShow',
            name: 'kgShow',
            component: kgShow
        },
        {
            path: '/visitor_wordKg',
            name: 'visitor_wordKg',
            component: visitor_wordKg
        },
        {
            path: '/selectEnterCatalog',
            name: 'selectEnterCatalog',
            component: selectEnterCatalog
        },
        {
            path: '/preview',
            name: 'preview',
            component: preview
        },
        {
            path: '/trash_list',
            name: 'trash_list',
            component: trash_list
        },
    ]
})