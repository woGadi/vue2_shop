import request from '@/utils/request'

export const getGoodsListAPI = function (queryList) {
  return request.get('/goods', {
    params: queryList
  })
}
