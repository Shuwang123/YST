// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入自定义指令
import '@/assets/js/directives'
import Vueydui from 'vue-ydui'
import 'vue-ydui/dist/ydui.base.css'
import 'vue-ydui/dist/ydui.rem.css'
Vue.use(Vueydui)
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from '../node_modules/axios/index'
Vue.prototype.$ios = axios

import VueCookie from 'vue-cookie'
import '../theme/index.css'
import '@/element-ui'
import '@/assets/scss/index.scss'
import store from './store'
import "@/assets/font/iconfont.css"
import { isAuth } from '@/utils'
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.isAuth = isAuth // 挂载权限方法

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
