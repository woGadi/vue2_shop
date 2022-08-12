module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential' /* '@vue/standard' */],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 在方法的形参 () 之前, 是否必须有空格
    'space-before-function-paren': ['off', 'never'],
    // 消除 eslint 对驼峰命名的警告，配合 vue.config.js 的
    // properties: 'off',
    // eslint 要忽视命名限制的组件名称；消除 eslint 对驼峰命名的警告
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Home', 'Login', 'Welcome', 'Users', 'Report', 'Roles', 'Rights', 'Order', 'Params', 'List', 'Cate', 'Add']
      }
    ]
  }
}
