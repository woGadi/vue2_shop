import request from '@/utils/request'

// 获取查询将要修改项的参数信息
export const editParamsAPI = function (cateId, attrId, newAttrName, activeTabName) {
  return request.put(`categories/${cateId}/attributes/${attrId}`, { attr_name: newAttrName, attr_sel: activeTabName })
}
