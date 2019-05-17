/**
 * cx 自己封装的一些验证，如果要完善，可以继续在这优化嘛
 */
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
  var reg = /^([1-9]\d*|[0]{1, 1})$/
  return reg.test(s)
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
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

// 2019.5.17新增 日期与年龄 的相互转换：出来的是 18岁或1月,传入时的时间格式要求是这些才行：/Date(1501231820930)/ 或 2019/10/02 或 2019-10-02
export function calcAge (time) {
  if (time.includes('/Date(')) { // 这种 /Date(1555124337033)/ 无法直接用，得先弄成1555124337033，且还要弄成数字类型，不能为字符串
    time = Number(time.substring(6, time.length - 2)) // 从arr[i]~arr[j]
  } else { // 这种 2019/4/12 10:01:09 和 '2019-04-23 00:35:55' 这种都能直接处理，那就直接传递呗，不处理了
  }
  var date = new Date(time)
  var birthDate = formatDate(date, 'yyyy-MM-dd'), nowYear = formatDate(new Date(), 'yyyy-MM-dd') // 最后返回的类型是 2019-10-02 这种
  var birthArr = birthDate.split('-'), nowArr = nowYear.split('-')
  var lastUnit = '岁'
  var lastAge = ''
  if (nowArr[0] - birthArr[0] === 0) { // 2019-2019=0 这种肯定没有一岁的，只需要考虑月的问题
    lastUnit = '月'
    if (nowArr[1] - birthArr[1] === 0 || nowArr[1] - birthArr[1] === 1) { // 这种30天以内的，干脆就算成一个月吧
      lastAge = 1
    } else if (nowArr[1] - birthArr[1] > 1 && nowArr[2] - birthArr[2] < 0) {
      lastAge = nowArr[1] - birthArr[1] - 1
    } else if (nowArr[1] - birthArr[1] > 1 && nowArr[2] - birthArr[2] >= 0) {
      lastAge = nowArr[1] - birthArr[1]
    }
  } else if (nowArr[0] - birthArr[0] === 1) { // 2019-2018=1 这种1岁多、刚好1岁、或几个月都有可能
    if (nowArr[1] - birthArr[1] >= 1) {
      lastUnit = '岁'
      lastAge = 1
    } else if (nowArr[1] - birthArr[1] === 0 && nowArr[2] - birthArr[2] >= 0) {
      lastUnit = '岁'
      lastAge = 1
    } else {
      lastUnit = '月'
      lastAge = nowArr[1] - birthArr[1] + 12 - 1
    }
  } else if (nowArr[0] - birthArr[0] >= 2) { // 2019-2017=1 这种肯定是岁了，关键是判断1岁还是2岁，需要更具月份和日期确定+1-1
    lastUnit = '岁'
    if (nowArr[1] - birthArr[1] >= 1) {
      lastAge = nowArr[0] - birthArr[0]
    } else if (nowArr[1] - birthArr[1] === 0 && nowArr[2] - birthArr[2] >= 0) {
      lastAge = nowArr[0] - birthArr[0]
    } else {
      lastAge = nowArr[0] - birthArr[0] - 1
    }
  } else {
    lastUnit = '岁'
    lastAge = 0
  }
  return `${lastAge}${lastUnit}`
}
// 2019.5.17新增 日期与年龄 的相互转换 （后来冒出死循环放弃了）
// export function calcTimeStamp (num, ageUnit) { // '1'岁 '0'月
//   var nowYearArr = formatDate(new Date(), 'yyyy-MM-dd').split('-')
//   var BirthDate = ''
//   if (ageUnit === '1') {
//     BirthDate = `${nowYearArr[0] - num}-01-01`
//   }
//   return BirthDate
// }
