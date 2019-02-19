/**
 * Created by dx on 18/6/7.
 */
import request from '../request'
// 导出售后点评报表
export function productReviewReportListExport (params) {
  return request({
    url: '/admin/report/export/reviewReport',
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  })
}
// 导出售后点评
export function productReviewListExport (params) {
  return request({
    url: '/admin/report/export/review',
    method: 'get',
    params: params,
    responseType: 'arraybuffer'
  })
}
