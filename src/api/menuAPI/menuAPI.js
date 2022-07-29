// 获取侧边栏菜单数据
import request from '@/utils/request'

// 获取菜单数据的封装函数
export const getMenuListAPI = function () {
  return request.get('menus')
}
