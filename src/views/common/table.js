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
  if (rowIndex >= 0) {
    return 'warning-row'
  } else {
    return ''
  }
}
export default comObj
