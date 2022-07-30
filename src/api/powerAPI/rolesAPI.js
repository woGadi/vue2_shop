// 获取角色列表数据
import request from '@/utils/request'

export const getRolesListAPI = function () {
  return request.get('/roles')
}
