import request from '@/utils/request'

export const addAPI = function (form) {
  return request.post('goods', form)
}
