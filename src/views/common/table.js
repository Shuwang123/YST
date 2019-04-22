const comObj = {}
// 通用表头样式
comObj.tableHeaderStyle = function () {
  return {
    'fontWeight': 600,
    'color': '#676A6C'
  }
}
// 针对表头：最开始35px高度的,后来又莫名其妙改成了40和elementUI默认表头高度貌似一致，所以看到了tableHeaderStyle、tableHeaderStyle40px这两个不要太懵逼
comObj.tableHeaderStyle40px = function () {
  return {
    'fontWeight': 600,
    'color': '#676A6C',
    'height': '40px',
    'line-height': '40px'
  }
}
comObj.tableHeaderStyle30px = function () {
  return {
    'fontWeight': 600,
    'color': '#909399',
    'height': '30px',
    'line-height': '30px'
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
