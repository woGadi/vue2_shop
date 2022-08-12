import request from '@/utils/request'

// 编辑提交商品
export const editGoodsAPI = function (goodsId, editForm) {
  return request.put(`goods/${goodsId}`, editForm)
}
