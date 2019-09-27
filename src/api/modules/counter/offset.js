import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 创建退费信息
export function createOffset (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/CreateRo'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取退费单列表
export function getOffsetList (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/RoLoadData'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退费单入库
export function offsetSubmit (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/AuditdRo'),
    method: 'post',
    data: requestParam(params)
  })
}
// 作废退费单
export function offsetCancel (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/CancelRoSaleOrder'),
    method: 'post',
    data: requestParam(params)
  })
}