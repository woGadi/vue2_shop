// 添加用户到用户列表
import request from '@/utils/request'

// 添加用户请求的封装函数
export const addUserAPI = function (addForm) {
  return request.post('users', addForm)
}
