/**
 * Created by dx on 18/3/19.
 */
const getters = {
  documentClientIFRMAE: state => state.documentClientIFRMAE,

  // cx
  getRegisterStep: state => state.registerStep,

  getAccountLoginInfoAll: state => state.accountLoginInfoAll,
  getAccountIsDoctor: state => state.accountIsDoctor,
  getAccountCurrentHandleStore: state => state.accountCurrentHandleStore
}
export default getters
