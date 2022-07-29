import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制页面的访问权限
router.beforeEach((to, from, next) => {
  // 如果用户访问的是登录页面，直接放行
  if (to.path === '/login') return next()
  // 如果用户不是访问登录页面，那有 token 吗 (登录成功才有 token)
  const tokenStr = window.sessionStorage.getItem('token')
  // 若没有 token，证明用户没有通过登录，那么让其跳转到登录页面
  if (!tokenStr) return next('/login')
  // 若用户正常登录，那么放行
  next()
})

export default router
