import request from '@/utils/request'

// 请求删除分类
export const deleteCateAPI = function (cateId) {
  return request.delete(`categories/${cateId}`)
}
