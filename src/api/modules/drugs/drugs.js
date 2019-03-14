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

// 获取药品分类
export function getDrugsCategory () {
  return request({
    url: requestUrl('/YstApiProduct/LoadCategory'),
    method: 'get',
    parmas: requestParam('get')
  })
}

// 创建添加药品
export function createDrugs (params) {
  return request({
    url: requestUrl('/YstApiProduct/Create'),
    method: 'post',
    data: requestParam(params)
  })
}
