import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取对应门店对应库存：库存统计与查询
export function getStoreInventory (params) {
  return request({
    url: requestUrl('/YstStoreInventory/LoadDataInventory'),
    method: 'post',
    data: requestParam(params)
  })
}
