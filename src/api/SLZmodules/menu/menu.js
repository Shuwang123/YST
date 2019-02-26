import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 新增权限点 // post菜单列表--分页接口 yes
export function add (params) {
  return request({
    url: requestUrl('/YstApiMenu/Create'),
    method: 'POST',
    data: requestParam(params)
  })
}
// 删除权限
export function deletes (params) {
  return request({
    url: requestUrl('/mobilereport/admin/permission/delete'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 修改权限点 yes
export function edit (params) {
  return request({
    // url: requestUrl('/mobilereport/admin/permission/edit'),
    url: requestUrl('/proxyApi/YstApiMenu/Create'),
    method: 'post',
    data: requestParam(params)
  })
}
export function search (params) {
  return request({
    url: requestUrl('/YstApiMenu/LoadData'),
    method: 'POST',
    data: requestParam(params)
  })
}

// 获取所有权限
export function list (params) {
  return request({
    url: requestUrl('/mobilereport/admin/permission/list'), // /api/permission/list
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 新增时获取权限
export function addlist (params) {
  return request({
    url: requestUrl('/mobilereport/admin/permission/list'), // /api/permission/list/add
    method: 'get',
    params: requestParam(params, 'get')
  })
}


