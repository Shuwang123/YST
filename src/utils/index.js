/**
 * 〇 是否有权限
 * @param {*} key    陈希登陆退出等问题，以下四个方法
 */
export function isAuth (key) {
  if (sessionStorage.getItem('userInfo')) {
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    return userInfo.permissions.indexOf(key) !== -1 || false
  } else {
    return false
  }
}
export function setStore (name, content) {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}
export function getStore (name) {
  if (!name) return
  var getStr = window.sessionStorage.getItem(name) !== undefined ? window.sessionStorage.getItem(name) : ''
  return getStr
}
export function removeStore (name) {
  if (!name) return
  window.sessionStorage.removeItem(name)
}



/** ① chenxi 陈希start   用的时候必须先：import {setStore} from '@/utils'
 * import {key} from '@/utils' 陈希2019.5.5对账号登陆后返回的：账号信息、是否是医生类账号、当前选中门店等状态进行封装；提供给 采购、挂号、开方模块 使用
 * accountLoginInfoAll、accountIsDoctor、accountCurrentHandleStore 账号信息、是否是医生类账号、当前选中门店
 */
export function setAccountData (name, content) {
  if (!name) return
  if (typeof content !== 'string') { // 如果传递进来的内容不是格式好了的字符串类型，那必须先序列化好
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content) // 序列化好了，就存了呗
}

export function getAccountData (name) {
  if (!name) return
  var getStr = window.sessionStorage.getItem(name) !== undefined ? window.sessionStorage.getItem(name) : ''
  return JSON.parse(getStr)
}
export function removeAccountData (name) {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/** ③ chenxi 陈希start 导出 EXCEL 封装
 *     用的时候必须先：import {myExportExcel} from '@/utils'
 */
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export function myExportExcel (data, name) {
  // core
  // generate workbook object from table
  var wb = XLSX.utils.table_to_book(data)
  // get binary string as output
  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
  try {
    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), (name === null ? 'sheet' : name) + '.xlsx')
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}



/**
 * 获取路由名称, 根据url地址
 * @param {*} url
 */
export function getRouteNameByUrl (url) {
  let val = /.*\/(.*)\.html/.exec(url)
  return val && val.length >= 1 ? val[1] : ''
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 获取字符串字节长度
 * @param {*} s
 */
export function getStringLength (s) {
  return s.replace(/[\u4e00-\u9fa5\uff00-\uffff]/g, '**').length
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

// 遍历单个节点
function traverseNode (node, list) {
  list.push(node)
}

// 递归遍历树
export function traverseTree (node, list) {
  if (!node) {
    return
  }
  traverseNode(node, list)
  if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      traverseTree(node.children[i], list)
    }
  }
}

// 异步加载图片
export function fileToBase64 (file, callback) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    if (callback) callback(reader.result)
  }
}

// 笛卡儿积组合
export function descartes (list) {
  var point = {}
  var result = []
  var pIndex = null
  var tempCount = 0
  var temp = []

  // 根据参数列生成指针对象
  for (var index in list) {
    if (typeof list[index] === 'object') {
      point[index] = {'parent': pIndex, 'count': 0}
      pIndex = index
    }
  }
  // 单维度数据结构直接返回
  if (pIndex == null) {
    return list
  }

  // 动态生成笛卡尔积
  while (true) {
    for (var index in list) {
      tempCount = point[index]['count']
      temp.push(list[index][tempCount])
    }
    result.push(temp) // 压入结果数组
    temp = [] // 检查指针最大值问题
    while (true) {
      if (point[index]['count'] + 1 >= list[index].length) {
        point[index]['count'] = 0
        pIndex = point[index]['parent']
        if (pIndex == null) { return result }
        index = pIndex// 赋值parent进行再次检查
      } else {
        point[index]['count']++
        break
      }
      removeStore
    }
  }
}

export function fileToPushDeal (file, callback) {
  var reader = new FileReader()
  if (file.raw) {
    reader.readAsDataURL(file.raw) // 读出 base64
    reader.onloadend = () => {
      callback(reader.result)
    }
  } else {
    callback(file.url)
  }
}
