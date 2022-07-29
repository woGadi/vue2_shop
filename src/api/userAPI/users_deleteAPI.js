// 删除用户信息
import request from '@/utils/request'

// 通过 id 来删除对应的用户信息
export const deleteUserAPI = function (id) {
  return request.delete(`users/${id}`)
}
