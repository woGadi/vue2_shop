import request from '@/utils/request'

// 删除角色权限的 API
export const deleteRightAPI = function (roleId, rightId) {
  return request.delete(`roles/${roleId}/rights/${rightId}`)
}

// 添加角色权限的 API
export const addRightsAPI = function (roleId, idStr) {
  return request.post(`roles/${roleId}/rights`, { rids: idStr })
}
