import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取日报表
export function getDayReport (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/DayReport'),
    method: 'POST',
    data: requestParam(params)
  })
}
// 创建日报表（在获取后的基础上稍微修改）
export function createDayReport (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/CreateDayReport'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取医生报表
export function getDoctorReport (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/DoctorDayReport'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取药品使用报表
export function getDrugsUseReport (params) {
  return request({
    url: requestUrl('/YstReport/GetSaleOrderSummaryList'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取退单报表 新增
export function getOffsetReport (params) {
  return request({
    url: requestUrl('/YstApiSaleOrder/RoDayReport'),
    method: 'POST',
    data: requestParam(params)
  })
}