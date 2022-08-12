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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 request 和 response 拦截器
// nprogress 包也导入在里面
import { reqInterceptorAPI, resInterceptorAPI } from '@/api/authorizationAPI.js'
reqInterceptorAPI()
resInterceptorAPI()

Vue.config.productionTip = false

// 全局注册 TreeTable 组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 格式化时间的全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
