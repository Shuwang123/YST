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
