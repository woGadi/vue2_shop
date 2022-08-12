// 接口授权相关的 API 接口
import request from '@/utils/request.js'

// 导入 nprogress 包对应的 JS 和 CSS
// 用于进度条加载
import NProgress from 'nprogress'
// 以下样式转移到 public/index.html 里去了 (通过 externals 加载外部 CDN 资源，步骤二)
// import 'nprogress/nprogress.css'

// axios 请求拦截器保障接口权限
export const reqInterceptorAPI = function () {
  // request 拦截器
  return request.interceptors.request.use((config) => {
    // 展示进度条
    NProgress.start()
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config)
    // 固定写法：必须 return config (为啥)
    return config
  })
}

export const resInterceptorAPI = function () {
  // response 拦截器
  return request.interceptors.response.use((config) => {
    // 隐藏进度条
    NProgress.done()
    return config
  })
}
