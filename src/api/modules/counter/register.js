import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取医生list (这个接口没使用，原因：网址蹦了，后端写的新接口又无法使用，只得回去调用的崩掉之前的那个旧的)
export function getDoctors (params) {
  return request({
    url: requestUrl('/YstApiAccount/LoadData'),
    method: 'get',
    params: requestParam('get')
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
