import request from '@/utils/request'

// 请求删除商品
export const removeGoodsByIdAPI = function (id) {
  return request.delete(`goods/${id}`)
}
