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

import cxobj from './views/common/table' // 这个是陈希写的一个自定义的全局的公用的统一的table样式，其中有表头的样式，表体的样式行的高度35px等等（因为elementUI那个50px高度太丑了）
import './views/common/table.scss' // 引入公用的table表体样式，需搭配上面js中的tableRowClassName方法
Vue.prototype.$cxObj = cxobj

import VueCookie from 'vue-cookie'
import '../theme/index.css'
import '@/element-ui'
import '@/assets/scss/index.scss'
import store from './store'
import "@/assets/font/iconfont.css"
import { isAuth, getAccountData } from '@/utils' // sessionStorage
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.isAuth = isAuth // 挂载权限方法

import {formatDate} from '@/utils/validate' // cx 全局自定义时间转化：时间戳 和 格式日期之间，或时间戳 和 年龄之间等等
// 管道符前的数据time、+ structure 结构参数（如：scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')）调用时
// filter是过滤、format是格式化
Vue.filter('myDateFilter', function (time, structure) {
  if (time.includes('/Date(')) {
    // 这种 /Date(1555124337033)/ 无法直接用，得先弄成1555124337033，且还要弄成数字类型，不能为字符串
    time = Number(time.substring(6, time.length - 2)) // 从arr[i]~arr[j]
  } else { }// 这种 2019/4/12 10:01:09 和 '2019-04-23 00:35:55' 这种都能直接处理，那就直接传递呗，不处理了

  var date = new Date(time)
  return formatDate(date, structure) // 最后返回的类型是 2019-10-02 10:00 这种
})
// 当初打算接着在这写时间与年龄之间的转换，后来想了想感觉过滤器用在‘时间’和‘年龄’的转换上不是很符合常规思维，
// 就换到@utils/validate.js里去了，用export公共接口的方式来实现，不过缺点嘛就是用之前得先在对应子组件import {} from './xx.js' calcAge(time)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // console.log('// 2019.5.5 cx 新增, 全局监听页面刷新保存用户info')
    // console.log(this.$store.getters.getAccountLoginInfoAll)
    if (this.$store.getters.getAccountLoginInfoAll === null) { // 证明刷新了页面把内存中Vuex的账户信息等变量销毁了，需要重新手工赋值，取值来源session
      this.$store.commit('setAccountLoginInfoAll', getAccountData('accountLoginInfoAll'))
      // console.log(this.$store.getters.getAccountLoginInfoAll)
    }
    if (this.$store.getters.getAccountCurrentHandleStore === '') {
      this.$store.commit('setAccountCurrentHandleStore', getAccountData('accountCurrentHandleStore'))
    }
    if (this.$store.getters.getAccountIsDoctor === '') {
      this.$store.commit('setIsDoctor', getAccountData('accountIsDoctor'))
    }
  }
})
