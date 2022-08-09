import request from '@/utils/request'

// 查看物流信息
// 这个接口失效了
export const queryProgressInfoAPI = function () {
  return request.get('/kuaidi/1106975712662')
}
