/**
 * Created by dx on 18/3/19.
 */
const getters = {
  documentClientIFRMAE: state => state.documentClientIFRMAE,

  // cx
  getRegisterStep: state => state.registerStep,

  getAccountLoginInfoAll: state => state.accountLoginInfoAll,
  getAccountIsDoctor: state => state.accountIsDoctor,
  getAccountCurrentHandleStore: state => state.accountCurrentHandleStore,
  getAllDoctorIdArr: state => state.allDoctorIdArr,

  // 2019 07 18 离开开方页时的存档，进入开方页时调用
  getRecipelSaveFiles: state => state.recipelSaveFiles
}
export default getters
