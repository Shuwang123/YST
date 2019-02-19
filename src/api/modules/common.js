import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// 获取验证码
export function captcha (uuid) {
  return requestUrl(`/captcha.jpg?uuid=${uuid}`)
}
// 登录
export function login (params) {
  return request({
    url: requestUrl('/mobilereport/admin/login'), // /admin/login
    method: 'post',
    params: requestParam(params, 'get')
  })
}

// 退出
export function logout () {
  return request({
    url: requestUrl('/mobilereport/admin/logout'), // /admin/logout
    method: 'post',
    data: requestParam()
  })
}
export function adminStoreAdd (params) {
  return request({
    url: requestUrl('/admin/store/add'),
    method: 'post',
    params: requestParam(params)
  })
}
// 获取地址接口
export function cityAreas (params) {
  return request({
    url: requestUrl('/api/city/areas'),
    method: 'get',
    data: requestParam(params, 'get')
  })
}
// 上传文件
export function upload () {
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : process.env.API_URL) + '/api/file/upload'
}
