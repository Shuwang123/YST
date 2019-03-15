import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取所有药材的列表
export function getDrugsList (params) {
  return request({
    url: requestUrl('/YstApiProduct/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取所有药品分类
export function getDrugsCategory () {
  return request({
    url: requestUrl('/YstApiProduct/LoadCategory'),
    method: 'get',
    parmas: requestParam('get')
  })
}

// 创建添加药品 保存
export function createDrugs (params) {
  return request({
    url: requestUrl('/YstApiProduct/Create'),
    method: 'post',
    data: requestParam(params)
  })
}

// 编辑药品  先获取
export function getEdit (params) {
  return request({
    url: requestUrl('/YstApiProduct/GetEdit'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
// 编辑药品  保存
export function submitEdit (params) {
  return request({
    url: requestUrl('/YstApiProduct/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}

// 药品批量下架或下架
export function drugsOff (params) {
  return request({
    url: requestUrl('/YstApiProduct/PutOff'),
    method: 'post',
    data: requestParam(params)
  })
}
// 药品批量上架或上架
export function drugsOn (params) {
  return request({
    url: requestUrl('/YstApiProduct/PutOn'),
    method: 'post',
    data: requestParam(params)
  })
}
