// 修改用户信息的预校验并提交
import request from '@/utils/request'

// 将修改后的用户信息提交给服务器
export const editUserAPI = function (id, email, mobile) {
  return request.put(`users/${id}`, {
    email,
    mobile
  })
}
