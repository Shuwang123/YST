import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 新增用户
export function adminUserAdd (params) {
  return request({
    url: requestUrl('/mobilereport/admin/account/update'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
/* // 删除用户
export function adminUserDelete (params) {
  return request({
    url: requestUrl('/api/adminuser/delete'),
    method: 'post',
    params: requestParam(params, 'get')
  })
} */
// 用户详情
export function adminUserDetail (params) {
  return request({
    url: requestUrl('/mobilereport/admin/account/info'),
    method: 'GET',
    params: requestParam(params, 'get')
  })
}

// 修改用户信息
export function adminUserEdit (params) {
  return request({
    url: requestUrl('/mobilereport/admin/account/update'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 获取用户列表 ？？？
export function adminUserList (params) {
  return request({
    url: requestUrl('/YstApiAccount/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}
/* // 重置密码
export function resetPassword (params) {
  return request({
    url: requestUrl('/api/adminuser/resetPassword'),
    method: 'post',
    params: requestParam(params, 'get')
  })
} */

// 获取用户门店列表
export function adminStoreList (params) {
  return request({
    url: requestUrl('/mobilereport/admin/store/account/list'), // ，/stocktaking/admin/account/store/list
    method: 'GET',
    params: requestParam(params, 'get')
  })
}
// 获取用户角色列表
export function adminRoleList (params) {
  return request({
    url: requestUrl('/stocktaking/admin/account/role/list'),
    method: 'GET',
    params: requestParam(params, 'get')
  })
}
