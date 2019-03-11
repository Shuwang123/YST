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
  documentClientIFRMAE: document.documentElement['clientHeight'] - 240
}

const store = new Vuex.Store({
  state,
  modules: {
    user,
    common
  },
  actions,
  mutations,
  getters,
  strict: process.env.NODE_ENV !== 'production'
})
export default store
