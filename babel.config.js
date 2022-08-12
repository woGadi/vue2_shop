// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
/* 若项目执行 build 操作, 也就是要发布了, 就会
将移除 console 的配置项加入到 plugins 节点中 */
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组, 展开数组中的每一项
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
