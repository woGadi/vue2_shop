<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  /*eslint-disable*/
  name: 'Home',
  methods: {
    // 退出登录的方法
    logout() {
      // 先清空 token
      window.sessionStorage.clear()
      // 再跳转到登录页面
      this.$router.push('/login')
    }
  },
  created() {
    // console.log(this)
  }
}
</script>

<style lang="less" scoped></style>
