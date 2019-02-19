import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 获取所有门店信息
export function storeAll (params) {
  return request({
    url: requestUrl('/mobilereport/admin/store/list'), // /admin/store/all
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
