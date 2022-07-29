// 查询用户信息
import request from '@/utils/request'

// 查询用户信息供用户进行修改
export const queryUsersAPI = function (id) {
  return request.get(`users/${id}`)
}
