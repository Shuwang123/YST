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
        {path: '/drugs/nameList', component: _import('drugs/index'), name: 'nameList', meta: {title: '药名列表', keepAlive: false}},
        /* 进销存模块End */

        /* 供应商模块：供应商Begin */
        {path: '/drugs/supplierList', component: _import('supplier/index'), name: 'supplierList', meta: {title: '供应商列表', keepAlive: false}},
        /* 供应商模块End */
        /* 入库单模块：入库单Begin 创建入库单、之后生成入库单列表 */
        {path: '/drugs/purchase', component: _import('purchase/index'), name: 'purchaseList', meta: {title: '入库单', keepAlive: false}},
        {path: '/drugs/purchaseList', component: _import('purchaseList/index'), name: 'purchaseListAll', meta: {title: '入库单列表', keepAlive: false}},
        /* 入库单模块End */
        /* 库存管理模块：Begin */
        {path: '/drugs/inventoryList', component: _import('inventory/index'), name: 'inventoryList', meta: {title: '库存详情', keepAlive: false}},
        /* 库存管理模块End */

        /* 柜台模块：挂号、收银、患者member、积分、医生排班 Begin */
        {path: '/register/register', component: _import('register/index'), name: 'register', meta: {title: '挂号', keepAlive: false}},
        {path: '/register/cashier', component: _import('cashier/index'), name: 'cashier', meta: {title: '收银', keepAlive: false}},
        {path: '/register/member', component: _import('member/index'), name: 'member', meta: {title: '会员管理', keepAlive: false}},
        {path: '/register/scheduling', component: _import('scheduling/index'), name: 'scheduling', meta: {title: '医生排班', keepAlive: false}},
        {path: '/register/inventoryList', component: _import('registerInventory/index'), name: 'registerInventoryList', meta: {title: '前台库存详情', keepAlive: false}},
        /* 柜台模块End */

        /* 医生模块：待就诊Begin treatment、recipel */
        {path: '/doctor/treatment', component: _import('doctor/index'), name: 'treatment', meta: {title: '待就诊', keepAlive: false}},
        {path: '/doctor/recipel', component: _import('doctorRp/index'), name: 'recipel', meta: {title: '开方', keepAlive: false}},
        {path: '/doctor/agreement', component: _import('agreementRecipel/index'), name: 'agreement', meta: {title: '协定方', keepAlive: false}},
        /* 柜台模块End */

        /* 门诊报表 start */
        {path: '/store/report', component: _import('reportDayForm/index'), name: 'reportDayForm', meta: {title: '门诊报表', keepAlive: false}},
        {path: '/store/drugsReport', component: _import('reportDrugsForm/index'), name: 'reportDrugsForm', meta: {title: '药品使用报表', keepAlive: false}},
        {path: '/store/reportCashier', component: _import('reportCashier/index'), name: 'reportCashier', meta: {title: '收银报表药品', keepAlive: false}},
        {path: '/store/reportCashierLL', component: _import('reportCashierLL/index'), name: 'reportCashierLL', meta: {title: '收银报表理疗', keepAlive: false}},
        /* 门诊报表 end */

        /* 退货单：2019.09.30新增需求 */
        {path: '/retreat', component: _import('purchaseRetreat/index'), name: 'retreat', meta: {title: '退货单', keepAlive: false}},
        {path: '/retreatList', component: _import('purchaseRetreatList/index'), name: 'retreatList', meta: {title: '退单列表', keepAlive: false}},

        /* 开方对应的退单功能，也是新增需求，和收银后退费不同，前者还没有出库只是退费； */
        /* 而这个是退单，包括了药材入库和收银扣除，使用退单得根据实际情况来用这个功能 */
        {path: '/offsetList', component: _import('doctorRpOffsetList/index'), name: 'offsetList', meta: {title: '开方退单列表', keepAlive: false}},
        {path: '/offsetPage', component: _import('doctorRpOffsetPage/index'), name: 'offsetPage', meta: {title: '开方退单', keepAlive: false}}
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
