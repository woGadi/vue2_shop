import request from '@/utils/request'

// 获取查询将要修改项的参数信息
export const queryParamsAPI = function (cateId, attrId, activeTabName) {
  return request.get(`categories/${cateId}/attributes/${attrId}`, { params: { attr_sel: activeTabName } })
}
