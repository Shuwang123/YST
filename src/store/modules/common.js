const state = {
  cityArea: [],
  align: 'center'
}
const getters = {
  align: state => state.align,
  cityArea: state => state.cityArea
}
const actions = {
  setUpCityeArea ({commit}, cityArea) {
    commit('UPCITYEAREA', cityArea)
  }
}
const mutations = {
  UPCITYEAREA (state, cityArea) {
    state.cityArea = cityArea
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
