import request from '@/utils/request'

export const getParentCateListAPI = function () {
  return request.get('categories', { params: { type: 2 } })
}
