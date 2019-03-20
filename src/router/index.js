import Vue from 'vue'
import Router from 'vue-router'
import {getStore} from '@/utils'
const _import = require('./import-' + process.env.NODE_ENV)
Vue.use(Router)
const whiteList = ['/login'] // 不重定向白名单
var router = new Router({
  mode: 'hash',
  routes: [
    /* 登录界面在这 */
    {path: '/login', name: 'login', component: _import('login/index')},
    {path: '/error404', name: 'error404', component: _import('errorPage404/error404')},
    {path: '/error401', name: 'error401', component: _import('errorPage401/error401')},
    {
      path: '/',
      name: 'layout',
      component: _import('layout/index'),
      redirect: {name: 'dashboard'},
      children: [
        /* 挡泥板 [首页] */
        {path: '/dashboard', component: _import('dashboard/testindex'), name: 'dashboard', meta: {title: '商城管理', keepAlive: false}},

        /* 菜单管理Begin */
        {path: '/system/meun', component: _import('meun/index'), name: 'meun', meta: {title: '菜单管理', keepAlive: false}},
        {path: '/system/role', component: _import('role/index'), name: 'role', meta: {title: '角色管理', keepAlive: false}},
        {path: '/system/user', component: _import('user/index'), name: 'user', meta: {title: '管理员列表', keepAlive: false}},
        /* 菜单管理End */

        /* 自定义树Begin */
        {path: '/tree/index', component: _import('tree/index'), name: 'tree', meta: {title: '自定义树', keepAlive: false}},
        /* 自定义树End */

        /* 门店管理Begin */
        {path: '/store/list', component: _import('store/index'), name: 'store', meta: {title: '门店列表', keepAlive: false}},
        /* 门店管理End */

        /* 进销存模块：药品Begin */
        {path: '/drugs/nameList', component: _import('drugs/index'), name: 'nameList', meta: {title: '药名列表', keepAlive: false}}
        /* 进销存模块End */
        /* 柜台模块：挂号Begin */
        {path: '/register/index', component: _import('register/index'), name: 'register', meta: {title: '挂号', keepAlive: false}}
        /* 柜台模块End */
      ]
    },
    {path: '*', name: 'error401', component: _import('errorPage401/error401')}
  ]
})
router.beforeEach((to, from, next) => {
  var userInfo = getStore('userInfo')
  if (userInfo && /\S/.test(userInfo)) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
