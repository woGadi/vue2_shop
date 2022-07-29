// 获取用户列表数据
import request from '@/utils/request'

export const getUserListAPI = function (info) {
  return request.get('/users', {
    params: info
  })
}
