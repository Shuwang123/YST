import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取医生列表
export function getDoctors (parmas) {
  return request({
    url: requestUrl('/YstApiAccount/LoadData'),
    method: 'get',
    parmas: requestParam('get')
  })
}

// 获取所有药材的列表
export function getDrugsList (params) {
  return request({
    url: requestUrl('/YstApiProduct/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}
