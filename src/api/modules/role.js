import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 角色新增
export function roleAdd (params) {
  return request({
    url: requestUrl('/YstApiRole/Create'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 角色删除
export function roleDelete (params) {
  return request({
    url: requestUrl('/YstApiRole/Delete'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 角色编辑
export function roleEdit (params) {
  return request({
    url: requestUrl('/YstApiRole/Edit'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 角色管理列表
export function jueseList (params) {
  return request({
    url: requestUrl('/YstApiRole/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}

// 角色详情
export function roleDetail (params) {
  return request({
    url: requestUrl('/YstApiRole/GetEdit'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 树形结构
export function rolePermissonList (params) {
  return request({
    url: requestUrl('/mobilereport/admin/permission/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 获取角色列表
export function roleListAdd (params) {
  return request({
    url: requestUrl('/mobilereport/admin/role/list'),
    method: 'post',
    data: requestParam(params)
  })
}

/* // 权限相关接口
export function rolePermissonListAdd (params) {
  return request({
    url: requestUrl('/api/permission/list/add'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 修改密码
export function updatePassword (params) {
  return request({
    url: requestUrl('/api/adminuser/updatePassword'),
    method: 'get',
    params: requestParam(params, 'get')
  })
} */
