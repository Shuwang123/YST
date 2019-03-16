// Currency ('提示文本') 只要求输入框有值就行
// Phone ()             要求输入框中电话长度必须11位纯数字
/**
 * 用法Phone(1) 表示输入框不能为空并且输入后也要验证；翻译（1）此项必填，所以扣1
 * 用法Phone()  表示输入框可以为空，但是如果你打算输入，那输入后同样会被验证
 * （针对那种选填的输入框设计的，就是说你不填能通过，但如果你要填就要填规范才能通过）
 */
// Letter ()            要求输入框不能有空格，且输入必须为字母

// 最简单的验证，无输入类型限制，只要求输入框有值
export function Currency (msg) {
  return [
    { required: true, message: msg, trigger: 'blur' }
  ]
}

// 统一验证电话var checkPhone = (rule, value, callback) => {this}
function phoneValidate1 (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val === '') {
    return callback(new Error('电话不能为空'))
  } else if (val.length >= 1 && val.length !== 11) {
    return callback(new Error('号码长度必须11位'))
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    return callback(new Error('不存在此格式的电话'))
  } else {
    callback()
  }
}
function phoneValidate (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val === '') {
    return callback()
  } else if (val.length >= 1 && val.length !== 11) {
    return callback(new Error('号码长度必须11位'))
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    return callback(new Error('不存在此格式的电话'))
  } else {
    callback()
  }
}
export function Phone (msg) {
  if (msg === 1) {
    return [
      { validator: phoneValidate1, trigger: 'blur' }
    ]
  } else {
    return [
      { validator: phoneValidate, trigger: 'blur' }
    ]
  }
}

// 要求输入框只能输入字母或拼音不限制大小写
function letterValidate1 (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val === '') {
    return callback(new Error('此为必填项'))
  } else if (val.length >= 1 && !/^[a-zA-Z]+$/.test(value)) {
    return callback(new Error('只允许输入字母'))
  } else {
    callback()
  }
}
function letterValidate (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val === '') {
    return callback()
  } else if (val.length >= 1 && !/^[a-zA-Z]+$/.test(value)) {
    return callback(new Error('只允许输入字母'))
  } else {
    callback()
  }
}
export function Letter (msg) {
  if (msg === 1) {
    return [
      { validator: letterValidate1, trigger: 'blur' }
    ]
  } else {
    return [
      { validator: letterValidate, trigger: 'blur' }
    ]
  }
}

// 要求输入框只能输入数字，且为整数
function numberIntValidate (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val === '') {
    return callback(new Error('输入的数字不能为空'))
  } else if (val.length >= 1 && !/^\d+$/.test(value)) {
    return callback(new Error('只允许输入number'))
  } else {
    callback()
  }
}
export function NumberInt () {
  return [
    { validator: numberIntValidate, trigger: 'blur' }
  ]
}

// 要求输入框只能输入数字，且为整数
function numberFloatValidate (rule, value, callback) {
  var val = String(value).replace(/\s/g, '')
  if (val.length !== String(value).length) {
    return callback(new Error('请不要乱整一些空格!'))
  }
  if (val.length >= 2 && val.charAt(val.length - 3) !== '.') {
    return callback(new Error('你输入的小数不符合规范!'))
  }
  if (val === '') {
    return callback(new Error('输入的数字不能为空'))
  } else if (val.length >= 1 && !/^\d+[.]{1}\d+$/.test(value)) {
    return callback(new Error('只允许输入number'))
  } else {
    callback()
  }
}
export function NumberFloat () {
  return [
    { validator: numberFloatValidate, trigger: 'blur' }
  ]
}
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
/**
 * 金额判断
 * @param {*} s
 */
export function isMoney (s) {
  var isNum = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
  return isNum.test(s)
}
/**
 * 正整数判断
 * @param {*} s
 */
export function isNum (s) {
  var reg = /^([1-9]\d*|[0]{1,1})$/
  return reg.test(s)
}
/**
 * 时间戳转时间格式
 * @param {*} s
 */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
