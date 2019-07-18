import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import NProgress from 'nprogress' // Progress 进度条
import { Message } from 'element-ui'
import {removeStore} from '@/utils'
import 'nprogress/nprogress.css'// Progress 进度条样式
// 创建axios实例
const service = axios.create({
  timeout: 3000 * 10,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  // baseURL: process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' :  process.env.API_URL
  // 为什么一直报错：POST https://www.easy-mock.com/mock/5c6a25ab218aad2259a06bc7/example/YstApiMenu/LoadData 404 (Not Found)
  baseURL: '/proxyApi'
  // baseURL: '/'
})

// request拦截器
service.interceptors.request.use(config => {
  NProgress.start()
  return config
}, error => {
  return Promise.reject(error)
})
// response拦截器
service.interceptors.response.use(response => {
  if (JSON.stringify(response.headers) == '{"content-type":"application/vnd.ms-excel;charset=UTF-8"}') {
    NProgress.done()
    return response
  }
  if (response.data && response.data.code === '403') { // 未登录
    removeStore('userInfo')
    router.push({ name: 'login' })
  } else if (response.data.code === '110' && response.data.message === '账号已过期') {
    removeStore('userInfo')
    router.push({ name: 'login' })
  } else if (response.data && response.data.code === '401') {
    Message.error({ message: '您没有权限进行相关操作' })
  } else if (response.data.code !== '200' && response.data.code !== '409') { // 添加返回码409的处理
    if (typeof response.data.data === 'object' && response.data.data === Array) {
      response.data.data.forEach(message => {
        Message.error({message: message})
      })
    } else {
      // Message.success({
      //   message: '响应成功！1000',
      //   duration: 1000
      // })
      // Message.success({message: response.data.message})
    }
  }

  NProgress.done()
  return response.data
}, error => {
  NProgress.done()
  if (error.response && error.response.data && error.response.data.status === '403') {
    removeStore('userInfo')
    router.push({ name: 'login' })
    Message.error({message: '请重新登录'})
  } else if (error.response && error.response.data && error.response.data.status === '401') {
    router.push({ name: 'error401' })
    Message.error({message: '您没有权限进行相关操作'})
  } else if (error.response && error.response.data && error.response.data.status === '401') {
    router.push({ name: 'error404' })
    Message.error({message: '您没有权限进行相关操作'})
  } else {
    Message.error({message: `${error.message}`})
    // removeStore('userInfo')
    // router.push({ name: 'login' })
  }
  return Promise.reject(error)
})
export default service
