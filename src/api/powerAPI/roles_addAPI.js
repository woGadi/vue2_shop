import request from '@/utils/request'

export const addRoleAPI = function (addRoleForm) {
  return request.post('roles', addRoleForm)
}
