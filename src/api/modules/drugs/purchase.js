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
