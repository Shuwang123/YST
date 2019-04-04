import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取所有供应商列表 库存：inventory + stock
export function getStoreStock (params) {
  return request({
    url: requestUrl('/YstStoreInventory/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}
