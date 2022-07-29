// 提交修改用户状态到服务器
import request from '@/utils/request'
import '@/components/user/Users.vue'

export const userStateChangedAPI = function (userId, userState) {
  return request.put(`users/${userId}/state/${userState}`)
}
