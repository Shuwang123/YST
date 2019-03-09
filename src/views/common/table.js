const comObj = {}
comObj.tableHeaderStyle = function () {
  return {
    'fontWeight': 600
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
