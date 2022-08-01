import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入 ele-ui 组件
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 全局的东西都要在入口模块导入吗？
// 导入全局样式表
import './assets/css/global.css'
// 导入树状表格第三方组件
import TreeTable from 'vue-table-with-tree-grid'

import { interceptorAPI } from '@/api/authorizationAPI.js'
interceptorAPI()

Vue.config.productionTip = false

// 全局注册 TreeTable 组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
