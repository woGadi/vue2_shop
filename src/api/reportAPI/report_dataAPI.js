import request from '@/utils/request'

// 获取图表的数据
export const getReportDataAPI = function () {
  return request.get('reports/type/1')
}
