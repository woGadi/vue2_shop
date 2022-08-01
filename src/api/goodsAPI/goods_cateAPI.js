import request from '@/utils/request'

// 获取商品分类数据列表
export const getCateListAPI = function (queryInfo) {
  return request.get('categories', { params: queryInfo })
}
