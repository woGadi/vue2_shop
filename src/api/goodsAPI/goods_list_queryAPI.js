import request from '@/utils/request'

// 请求查询商品列表数据
export const queryGoodsListAPI = function (goodsId) {
  return request.get(`goods/${goodsId}`)
}
