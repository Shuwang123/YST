import * as types from './mutation-types'

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

  // cx
  setRegisterStep (state, num) {
    state.registerStep = num
  }
}
