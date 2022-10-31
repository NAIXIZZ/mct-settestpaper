import Vue from 'vue'
import VueRouter from 'vue-router';
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'
import qs from 'qs'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
import * as echarts from 'echarts';
import JsonExcel from 'vue-json-excel'
// import tinymce from '@tinymce/tinymce-vue'

Vue.component('downloadExcel', JsonExcel)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.use(VueRouter)
Vue.use(ElementUI)
// Vue.use(tinymce)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App),
}).$mount('#app')


