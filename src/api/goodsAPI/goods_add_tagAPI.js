import Vue from 'vue'
import request from '@/utils/request'

// 添加参数 tag 标签
/* export const addParamsTagAPI = function (cateId, attrId, attrName, attrSel, attrVals) {
  return request.put(`categories/${cateId}/attributes/${attrId}`, { attr_name: attrName, attr_sel: attrSel, attr_vals: attrVals.join(' ') })
} */

// 因为要调用多次，所以直接封装“修改参数标签”的方法
export const addParamsTagAPI = async function (cateId, attrId, attrName, attrSel, attrVals) {
  const { data: res } = await request.put(`categories/${cateId}/attributes/${attrId}`, { attr_name: attrName, attr_sel: attrSel, attr_vals: attrVals.join(' ') })

  if (res.meta.status !== 200) return Vue.prototype.$message.error('修改标签失败了喔')

  Vue.prototype.$message.success('修改标签成功~')
}
