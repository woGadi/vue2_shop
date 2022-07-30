// 分配用户角色 API
import request from '@/utils/request'

export const setUserRoleAPI = function (userId, roleId) {
  return request.put(`users/${userId}/role`, { rid: roleId })
}
