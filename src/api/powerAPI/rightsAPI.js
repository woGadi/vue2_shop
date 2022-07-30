// 获取权限列表数据
import request from '@/utils/request'

// 获取权限列表的 API 函数
export const getRightsListAPI = function () {
  return request.get('rights/list')
}

// 获取权限树的 API 函数
// 权限树是数据的树形结构
export const getRightsTreeAPI = function () {
  return request.get('rights/tree')
}
