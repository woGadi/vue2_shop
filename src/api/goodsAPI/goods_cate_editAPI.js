import request from '@/utils/request'

// 请求编辑分类
export const editCateAPI = function (cateId, cat_name) {
  return request.put(`categories/${cateId}`, { cat_name })
}
