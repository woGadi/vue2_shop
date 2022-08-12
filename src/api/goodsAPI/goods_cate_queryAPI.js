import request from '@/utils/request'

// 请求查询商品分类
export const queryGoodsCateAPI = function (cateId) {
  return request.get(`categories/${cateId}`)
}
