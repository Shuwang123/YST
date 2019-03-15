const comObj = {}
// 通用表头样式
comObj.tableHeaderStyle = function () {
  return {
    'fontWeight': 600,
    'color': '#676A6C'
  }
}
// 针对表头：35px高度的
comObj.tableHeaderStyle40px = function () {
  return {
    'fontWeight': 600,
    'color': '#676A6C',
    'height': '40px',
    'line-height': '40px'
  }
}
comObj.tableRowClassName = function ({row, rowIndex}) {
  // 这是通用的35px行高表体
  if (rowIndex >= 0) {
    return 'all-row'
  } else {
    return ''
  }
}
export default comObj
