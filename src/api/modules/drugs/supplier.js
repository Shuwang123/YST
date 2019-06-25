import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取所有供应商列表
export function getSupplierList (params) {
  return request({
    url: requestUrl('/YstApiSupplier/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}

// 创建供应商
export function createSupplier (params) {
  return request({
    url: requestUrl('/YstApiSupplier/Create'),
    method: 'post',
    data: requestParam(params)
  })
}

// 编辑供应商
export function editSupplier (params) {
  return request({
    url: requestUrl('/YstApiSupplier/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}
