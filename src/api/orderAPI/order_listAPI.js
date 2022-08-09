import request from '@/utils/request'

export const getOrderListAPI = function (queryInfo) {
  return request.get('orders', { params: queryInfo })
}
