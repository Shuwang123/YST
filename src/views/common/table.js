const comObj = {}
comObj.tableHeaderStyle = function () {
  return {
    'fontWeight': 600,
    'color': '#676A6C'
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
