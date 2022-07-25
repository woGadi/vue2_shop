// 登录相关的 API 接口
import request from '@/utils/request.js'

// 登录发起 post 请求的封装函数
export const postLoginFormAPI = function (username, password) {
  return request.post('/login', {
    username,
    password
  })
}
