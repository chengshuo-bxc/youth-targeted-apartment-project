import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 前台布局
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/front/Home.vue'), meta: { title: '首页' } },
      { path: 'login', name: 'Login', component: () => import('@/views/front/Login.vue'), meta: { title: '登录' } },
      { path: 'register', name: 'Register', component: () => import('@/views/front/Register.vue'), meta: { title: '注册' } },
      { path: 'rooms', name: 'RoomList', component: () => import('@/views/front/RoomList.vue'), meta: { title: '房源列表' } },
      { path: 'rooms/:id', name: 'RoomDetail', component: () => import('@/views/front/RoomDetail.vue'), meta: { title: '房源详情' } },
      { path: 'analysis', name: 'DataAnalysis', component: () => import('@/views/front/DataAnalysis.vue'), meta: { title: '数据分析' } },
      { path: 'announcements', name: 'Announcements', component: () => import('@/views/front/Announcements.vue'), meta: { title: '公告中心' } },
      { path: 'contact', name: 'Contact', component: () => import('@/views/front/Contact.vue'), meta: { title: '联系我们' } },
    ]
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    redirect: '/user/profile',
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', name: 'UserProfile', component: () => import('@/views/user/Profile.vue'), meta: { title: '个人中心' } },
      { path: 'orders', name: 'UserOrders', component: () => import('@/views/user/Orders.vue'), meta: { title: '我的订单' } },
      { path: 'contracts', name: 'UserContracts', component: () => import('@/views/user/Contracts.vue'), meta: { title: '我的合同' } },
      { path: 'payments', name: 'UserPayments', component: () => import('@/views/user/Payments.vue'), meta: { title: '缴费记录' } },
    ]
  },
  {
    path: '/manager',
    component: () => import('@/layouts/ManagerLayout.vue'),
    redirect: '/manager/dashboard',
    meta: { requiresAuth: true, requiresManager: true },
    children: [
      { path: 'dashboard', name: 'ManagerDashboard', component: () => import('@/views/manager/Dashboard.vue'), meta: { title: '管家工作概览' } },
      { path: 'profile', name: 'ManagerProfile', component: () => import('@/views/manager/Profile.vue'), meta: { title: '管家信息' } },
      { path: 'rooms', name: 'ManagerRooms', component: () => import('@/views/manager/RoomManage.vue'), meta: { title: '房源管理' } },
      { path: 'orders', name: 'ManagerOrders', component: () => import('@/views/manager/OrderManage.vue'), meta: { title: '订单审核' } },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue'), meta: { title: '管理首页' } },
      { path: 'rooms', name: 'AdminRooms', component: () => import('@/views/admin/RoomManage.vue'), meta: { title: '房源管理' } },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/UserManage.vue'), meta: { title: '用户管理' } },
      { path: 'orders', name: 'AdminOrders', component: () => import('@/views/admin/OrderManage.vue'), meta: { title: '订单管理' } },
      { path: 'contracts', name: 'AdminContracts', component: () => import('@/views/admin/ContractManage.vue'), meta: { title: '合同管理' } },
      { path: 'payments', name: 'AdminPayments', component: () => import('@/views/admin/PaymentManage.vue'), meta: { title: '缴费管理' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '青年公寓服务系统'} - 青年公寓服务系统`

  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')

  if (to.meta.requiresAuth && !token) {
    return next('/login?redirect=' + to.fullPath)
  }

  if (to.meta.requiresAdmin && userInfo) {
    try {
      const user = JSON.parse(userInfo)
      if (user.role_type !== 'admin') return next('/')
    } catch {}
  }

  if (to.meta.requiresManager && userInfo) {
    try {
      const user = JSON.parse(userInfo)
      if (user.role_type !== 'manager') return next('/')
    } catch {}
  }

  next()
})

export default router
