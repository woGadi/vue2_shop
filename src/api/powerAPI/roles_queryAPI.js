import request from '@/utils/request'

export const queryRoleByIdAPI = function (roleId) {
  return request.get(`roles/${roleId}`)
}
