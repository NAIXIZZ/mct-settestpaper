import Vue from 'vue'
import VueRouter from 'vue-router';
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App),
  // onLaunch() {
  //   var BaaS = require('minapp-sdk')
  //   let clientID = '395062a19e209a770059'
  //   BaaS.init(clientID)
  // }
}).$mount('#app')


