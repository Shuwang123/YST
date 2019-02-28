import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 菜单添加
export function add (params) {
  return request({
    url: requestUrl('/YstApiMenu/Create'),
    method: 'POST',
    data: requestParam(params)
  })
}
// 菜单编辑
export function edit (params) {
  return request({
    url: requestUrl('/YstApiMenu/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}

// 菜单编辑前新鲜的row单行查询数据??????????????????????????????
export function getEdit (params) {
  return request({
    url: requestUrl('/YstApiMenu/GetEdit'),
    method: 'post',
    data: requestParam(params, 'get')
  })
}

// 菜单删除
export function deletes (params) {
  return request({
    url: requestUrl('/YstApiMenu/Delete'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 获取菜单数据，查询，分页
export function getMenu (params) {
  return request({
    url: requestUrl('/YstApiMenu/LoadData'),
    method: 'POST',
    data: requestParam(params)
  })
}

// 获取菜单tree树结构text 后端已把数据格式处理好
export function getTree () {
  return request({
    url: requestUrl('/YstApiMenu/LoadMenuTree'), // /api/permission/list
    method: 'get',
    params: requestParam('get')
  })
}

// // 获取所有权限
// export function list (params) {
//   return request({
//     url: requestUrl('/mobilereport/admin/permission/list'), // /api/permission/list
//     method: 'get',
//     params: requestParam(params, 'get')
//   })
// }
// // 新增时获取权限
// export function addlist (params) {
//   return request({
//     url: requestUrl('/mobilereport/admin/permission/list'), // /api/permission/list/add
//     method: 'get',
//     params: requestParam(params, 'get')
//   })
// }
