import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取门店库存：inventory + stock
export function getStoreStock (params) {
  return request({
    url: requestUrl('/YstStoreInventory/LoadDataInventory'),
    method: 'post',
    data: requestParam(params)
  })
}

// 编辑门店库存的：药材售价
export function editStoreStockSalePrice (params) {
  return request({
    url: requestUrl('/YstStoreInventory/EditStoreSalePrice'),
    method: 'post',
    data: requestParam(params)
  })
}



// 获取库存所有的 数量变动历史
export function getStockHistory (params) {
  return request({
    url: requestUrl('/YstStoreInventory/LoadDataHistory'),
    method: 'post',
    data: requestParam(params)
  })
}
// 获取批次信息
export function getStockBatch (params) {
  return request({
    url: requestUrl('/YstStoreInventory/LoadDataHistory'),
    method: 'post',
    data: requestParam(params)
  })
}
