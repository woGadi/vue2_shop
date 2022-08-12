import request from '@/utils/request'

export const editRoleAPI = function (roleId, roleName, roleDesc) {
  return request.put(`roles/${roleId}`, {
    roleName,
    roleDesc
  })
}
