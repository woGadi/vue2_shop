import request from '@/utils/request'

// 请求删除角色
export const deleteRolesAPI = function (roleId) {
  return request.delete(`roles/${roleId}`)
}
