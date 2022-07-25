<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 为啥叫 avatar 呢？ -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 登录和重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" :plain="true" @click="login">登录</el-button>
          <el-button type="info" :plain="true" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postLoginFormAPI } from '@/api/loginAPI.js'
export default {
  /*eslint-disable*/
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置用户名和密码
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate() 里回调函数的形参命名为 valid (有效的)
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起 axios 请求
        const { data: res } = await postLoginFormAPI(this.loginForm.username, this.loginForm.password)
        if (res.meta.status !== 200) return this.$message.error('登录失败了喔')
        this.$message.success('登录成功~')
        // 将服务器响应的 token 存储起来
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功后的页面跳转
        this.$router.push('/home')
      })
    }
  },
  created() {
    // console.log(this)
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    top: -25%;
    left: 50%;
    padding: 10px;
    height: 130px;
    width: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    transform: translate(-50%);
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>
