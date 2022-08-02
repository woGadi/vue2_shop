import request from '@/utils/request'

export const addParamsAPI = function (cateId, paramsName, activeTabName) {
  return request.post(`categories/${cateId}/attributes`, {
    attr_name: paramsName,
    attr_sel: activeTabName
  })
}
