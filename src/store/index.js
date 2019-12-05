/**
 * Created by dx on 18/3/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
// cx start
import {getAccountData} from '@/utils'

// import register from './modules/ownRegisterStatus' // 新增（cx）

Vue.use(Vuex)
const state = {
  // 侧边栏, 水平折叠收起状态
  sidebarCollapse: false,
  // 页面文档可视高度(随窗口改变大小)
  documentClientHeight: document.documentElement['clientHeight'],
  // 菜单导航
  menuNavList: [],
  // 内容区域tabs标签页
  contentTabs: [],
  contentAcitveTab: '', // 当前活跃的Tab
  contentTabsActiveName: '',
  documentClientIFRMAE: document.documentElement['clientHeight'] - 240,

  // cx(start)
  registerStep: 1, // 药房挂号模版那个挂号弹窗

  accountLoginInfoAll: null, // result.data 来源session session来源login.vue
  accountIsDoctor: '', // 判断是否是医生 true false
  accountCurrentHandleStore: '', // （初始值居然是null，不是‘’刷新清空内存情况下）只针对当前手选门店 在入库单、药房、医生这几个模块 手动改变comstore的option时响应变化
  allDoctorIdArr: '', // 医生类角色的所有角色Id

  // 2019 07 18
  recipelSaveFiles: [] // 离开开方页时的存档，进入开方页时调用
}

const store = new Vuex.Store({
  state,
  modules: {
    user,
    common
    // register // 新增（cx）
  },
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
export default store
