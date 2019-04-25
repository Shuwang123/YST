import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 获取会员列表
export function getMemberList (params) {
  return request({
    url: requestUrl('/YstApiUsers/LoadData'),
    method: 'post',
    data: requestParam(params)
  })
}
// export function getMemberList () {
//   return request({
//     url: requestUrl('/YstApiUsers/LoadData'),
//     method: 'get',
//     parmas: requestParam('get')
//   })
// }

// 添加会员
export function addMemberSubmit (params) {
  return request({
    url: requestUrl('/YstApiUsers/Create'),
    method: 'post',
    data: requestParam(params)
  })
}

// 编辑会员：编辑获取
export function editMemberGet (params) {
  return request({
    url: requestUrl('/YstApiUsers/GetEdit'),
    method: 'post',
    data: requestParam(params)
  })
}
// 编辑会员：编辑提交
export function editMemberSubmit (params) {
  return request({
    url: requestUrl('/YstApiUsers/Edit'),
    method: 'post',
    data: requestParam(params)
  })
}
