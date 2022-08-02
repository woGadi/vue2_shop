import request from '@/utils/request'

// 删除参数/属性
// id 是分类ID
export const removeParamsAPI = function (id, attrid) {
  return request.delete(`categories/${id}/attributes/${attrid}`)
}
