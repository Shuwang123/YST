import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 获取和查询门店信息
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

// 获取所有地址初始化级联组件
export function getAddress () {
  return request({
    url: requestUrl('/YstApiStore/LoadChildArea'),
    method: 'get',
    data: requestParam('get')
  })
}

// 新增提交
export function addSubmit (params) {
  return request({
    url: requestUrl('/YstApiStore/Create'),
    method: 'post',
    data: requestParam(params)
  })
}

// 编辑门店前先获取此行门店详情info
export function getStoreRow (params) {
  return request({
    url: requestUrl('/YstApiStore/GetEdit'),
    method: 'get',
    // data: requestParam('get')
    params: requestParam(params, 'get')
  })
}
// 编辑提交
export function editSubmit (params) {
  return request({
    url: requestUrl('/YstApiStore/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除提交
export function deleteSubmit (params) {
  return request({
    url: requestUrl('/YstApiStore/Delete'),
    method: 'post',
    data: requestParam(params)
  })
}
