import request from '@/utils/request'

// 获取分类参数
export const getCateParamsAPI = function (cateId, activeTabName) {
  return request.get(`categories/${cateId}/attributes`, { params: { sel: activeTabName } })
}
