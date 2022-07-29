<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="title">
        <img src="../assets/heima.png" alt="" />
        <p>电商后台管理系统</p>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? 64 + 'px' : 200 + 'px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- 当前激活菜单的 index：default-active -->
        <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转：router -->
        <!-- 是否开启折叠动画：collapse-transition -->
        <!-- 是否水平折叠收起菜单：collapse -->
        <!-- 是否只保持一个子菜单的展开：unique-opened -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="`/${subItem.path}`" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(`/${subItem.path}`)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 欢迎页面的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuListAPI } from '@/api/menuAPI/menuAPI.js'
export default {
  /*eslint-disable*/
  name: 'Home',
  data() {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    // 退出登录的方法
    logout() {
      // 先清空 token
      window.sessionStorage.clear()
      // 再跳转到登录页面
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await getMenuListAPI()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    // 侧边栏顶部的按钮，控制菜单展示效果
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  padding-left: 0;
  background-color: #363d40;
  justify-content: space-between;
}
.title {
  display: flex;
  width: 250px;
  p {
    margin-left: 15px;
    color: #fff;
    font-size: 20px;
  }
}
.el-button {
  margin: 10px 0;
}
.el-aside {
  background-color: #313743;
  .toggle-button {
    height: 30px;
    background-color: #4a5064;
    color: #fff;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
