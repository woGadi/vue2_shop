const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
  // 消除 eslint 对驼峰命名的警告，配合 eslintrc.js 的
  // lintOnSave: false
})

// 以下是项目优化：分离 “开发模式” 和 “发布模式” 的入口文件
module.exports = {
  chainWebpack: (config) => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过 externals 加载外部 CDN 资源，步骤一
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
