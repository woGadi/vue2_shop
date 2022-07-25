import Vue from 'vue'
// Message 是导入弹窗提示组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 因为 Element 为 Vue.prototype 添加了全局方法 $message
// 所以这里要进行全局挂载
Vue.prototype.$message = Message
