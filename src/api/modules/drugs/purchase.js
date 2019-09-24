import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取当前页面操作人的登陆详情，判断是管理员还是只有一个门店权限的账号类型
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

// 修改purchase采购单为 已收货未入库状态
export function handleStatus4 (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/FactoryDelivery'),
    method: 'post',
    data: requestParam(params)
  })
}

// 待收货：采购单编辑数量和价格后的保存
export function editNumberAndPrice (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}
// 已到货未入库：采购单编辑批号后的入库保存,同时采购单状态更新为10已入库
export function editBatchNo (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/StockIn'),
    method: 'post',
    data: requestParam(params)
  })
}



// 20190930新增需求：采购退单相关逻辑
// 创建 采购退单 // 初始为待审
export function createRetreat (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/Refund'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退单待审 -> 报废
export function retreatCancel (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/CancelRefund'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退单待审 -> 已审
export function retreatAuditedOK (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/AuditRefund'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退单已审 -> 出库 (完结状态)
export function retreatSuccess (params) {
  return request({
    url: requestUrl('/YstApiPurchaseOrder/StockOut'),
    method: 'post',
    data: requestParam(params)
  })
}


