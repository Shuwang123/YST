import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取医生list (这个接口没使用，原因：网址蹦了，后端写的新接口本身又还没写完的时候蹦的，之后回去调用崩掉之前的另一个旧的)
export function getDoctors (params) {
  return request({
    url: requestUrl('/YstApiAccount/LoadData'),
    method: 'get',
    params: requestParam('get')
  })
}

// 获取一级分类
  export function CategoryOneType (params) {
    return request({
      url: requestUrl('/YstApiSaleOrder/CategoryOneType'),
      method: 'post',
      data: requestParam(params)
    })
  }

  // 获取单据来源
  export function SaleOrderSource (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/SaleOrderSource'),
    method: 'post',
    data: requestParam(params)
  })
}

// 柜台挂号提交按钮
export function registerSubmit (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/Create'),
    method: 'post',
    data: requestParam(params)
  })
}
// 挂号费：退费功能
export function registerRevoke (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/CancelRegister'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取当前门店：当天所有挂号列表
export function getRegisterList (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}

// 挂号列表：某一行的详情
export function getRegisterInfo (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/GetSaleOrderById'),
    method: 'post',
    data: requestParam(params)
  })
}

// 20190719 作废 协定方 或 经典方
//
export function deleteAgreement (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/CancelSaleOrder'),
    method: 'post',
    data: requestParam(params)
  })
}




// 正常流程下的医生开方或者药房辅助开方，调用的 edit 接口(‘直接开方’调用的create接口)
export function sendRecipelToEdit (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}

// 收银接口,确认收取消费
export function cashierSubmit (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/PaymentSaleOrder'),
    method: 'post',
    data: requestParam(params)
  })
}

// 已收药费list下，确认出库接口, 销售订单确认提交
export function saleOrderSubmit (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/StockSaleOrder'),
    method: 'post',
    data: requestParam(params)
  })
}

// 已开方已收银未出库：处方收银后退费功能———————————（出了库的不能退费了，是新的逻辑流程）
export function cashierRevoke (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/SeeDoctorCancel'),
    method: 'post',
    data: requestParam(params)
  })
}
