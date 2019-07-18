import * as types from './mutation-types'
import {setAccountData} from '@/utils'

export default {
  [types.SWITCH_SIDEBAR_COLLAPSE] (state, { collapse }) {
    state.sidebarCollapse = collapse
  },

  [types.UPDATE_DOCUMENT_CLIENT_HEIGHT] (state, { height }) {
    state.documentClientHeight = height
  },
  [types.UPDATE_DOCUMENT_CLIENT_IFRAME] (state, { height }){
    state.documentClientIFRMAE = height
  },
  [types.UPDATE_MENU_NAV_LIST] (state, list) {
    state.menuNavList = list
  },

  [types.ADD_CONTENT_TAB] (state, tab) {
    state.contentTabs.push(tab)
  },

  [types.UPDATE_CONTENT_TABS] (state, tabs) {
    state.contentTabs = tabs
  },
  [types.UPDATE_CONTENT_TABS_ACTIVE] (state, tab) {
    state.contentAcitveTab = tab
  },

  [types.DELETE_CONTENT_TABS] (state) {
    state.contentTabs = []
  },

  [types.UPDATE_CONTENT_TABS_ACTIVE_NAME] (state, { name }) {
    state.contentTabsActiveName = name
  },

  // ①cx 挂号弹窗标题步骤控制
  setRegisterStep (state, num) {
    state.registerStep = num
  },

  // ②账号所有信息控制管理
  setAccountLoginInfoAll (state, content) {
    state.accountLoginInfoAll = content // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('accountLoginInfoAll', content)
  },
  // 账号是否是医生
  setIsDoctor (state, content) {
    state.accountIsDoctor = content // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('accountIsDoctor', content)
  },
  // 账号目前选中的默认门店（归属门店? 手选门店? 还是storeArr[0]门店?）
  setAccountCurrentHandleStore (state, content) {
    state.accountCurrentHandleStore = content // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('accountCurrentHandleStore', content)
  },
  // 账号目前选中的默认门店（归属门店? 手选门店? 还是storeArr[0]门店?）
  setAllDoctorIdArr (state, content) {
    state.allDoctorIdArr = content // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('allDoctorIdArr', content)
  },

  // 2019 07 18 离开开方页时的存档，进入开方页时调用
  setRecipelSaveFiles (state, content) {
    state.recipelSaveFiles.push(content) // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('recipels', state.recipelSaveFiles) // recipels: []
  },
  delRecipelSaveFiles (state, index) {
    state.recipelSaveFiles.splice(index, 1) // 先存给Vuex，同时下面顺手给sessionStorage
    setAccountData('recipels', state.recipelSaveFiles) // recipels: []
  }
}
