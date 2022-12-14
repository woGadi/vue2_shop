import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载的导入形式如下
// import Login from '@/components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Login.vue')
// import Home from '@/components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Home.vue')
// import Welcome from '@/components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Welcome.vue')

// import Users from '@/components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/user/Users.vue')
// import Rights from '@/components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Rights.vue')
// import Roles from '@/components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Roles.vue')

// import Cate from '@/components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Cate.vue')
// import Params from '@/components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Params.vue')

// import List from '@/components/goods/List.vue'
const List = () => import(/* webpackChunkName: "List_Add" */ '@/components/goods/List.vue')
// import Add from '@/components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "List_Add" */ '@/components/goods/Add.vue')

// import Order from '@/components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order.vue')
// import Report from '@/components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report.vue')

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
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
