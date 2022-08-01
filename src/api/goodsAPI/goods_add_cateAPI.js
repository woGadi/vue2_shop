import request from '@/utils/request'

export const addCateAPI = function (obj) {
  return request.post('categories', obj)
}
