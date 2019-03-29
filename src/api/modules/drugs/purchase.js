import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取当前页面操作人的登陆详情，判断是管理员还是只有一个门店的账号类型
export function getLoginInfo () {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/GetAccountInfo'),
    method: 'get',
    params: requestParam('get')
  })
}
// 正式提交采购单(创建采购单)
export function submitPurchase (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/Create'),
    method: 'post',
    data: requestParam(params)
  })
}

// 上面的接口创建采购单后，会生成很多历史采购列表
export function getPurchaseList (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}
// 有整个历史采购单的列表后，当然要有查看某条采购单的info了
export function getPurchaseInfo (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/Detail'),
    method: 'post',
    data: requestParam(params)
  })
}
// 当然也有删除某个purchase
export function deletePurchase (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/DeleteBatch'),
    method: 'post',
    data: requestParam(params)
  })
}
