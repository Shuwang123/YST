import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 新增用户
export function adminUserAdd (params) {
  return request({
    url: requestUrl('/YstApiAccount/Create'),
    method: 'POST',
    data: requestParam(params)
  })
}
// 禁用用户
export function adminUserDelete (params) {
  return request({
    url: requestUrl('/YstApiAccount/Disabled'),
    method: 'post',
    data: requestParam(params)
  })
}
// 启用账号
export function adminUserStart (params) {
  return request({
    url: requestUrl('/YstApiAccount/Actived'),
    method: 'post',
    data: requestParam(params)
  })
}
// 用户详情
export function adminUserDetail (params) {
  return request({
    url: requestUrl('/YstApiAccount/GetEdit'),
    method: 'POST',
    data: requestParam(params)
  })
}
// 修改用户信息
export function adminUserEdit (params) {
  return request({
    url: requestUrl('/YstApiAccount/Edit'),
    method: 'post',
    params: requestParam(params, 'get')
  })
}
// 获取用户列表
export function adminUserList (params) {
  return request({
    url: requestUrl('/YstApiAccount/LoadData'),
    method: 'POST',
    data: requestParam(params, 'get')
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

// 获取用户门店列表(这下面的两个api根本就没有调用，没用没用没用，不要误导人，脑壳给看晕了)
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
