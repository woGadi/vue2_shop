// 接口授权相关的 API 接口
import request from '@/utils/request.js'

// axios 请求拦截器保障接口权限
export const interceptorAPI = function () {
  return request.interceptors.request.use((config) => {
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    console.log(config)
    // 固定写法：必须 return config (为啥)
    return config
  })
}
