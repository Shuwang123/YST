import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 获取所有门店信息
export function storeAll (params) {
  return request({
    url: requestUrl('/YstApiStore/LoadData'), // /admin/store/all
    method: 'post',
    data: requestParam(params)
  })
}
// 获取门店权限接口
export function quanxianStore (params) {
  return request({
    url: requestUrl('/mobilereport/admin/store/account/list'), // /admin/store/all /mobilereport/admin/store/account/list
    method: 'get',
    params: requestParam(params, 'get')
  })
}

export function getAddress () {
  return request({
    url: requestUrl('/YstApiStore/LoadStore'), // /admin/store/all
    method: 'get',
    data: requestParam('get')
  })
}
