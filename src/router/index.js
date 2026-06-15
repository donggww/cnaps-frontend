import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/login/LoginView.vue'
import WorkbenchView from '@/views/workbench/WorkbenchView.vue'
import PermissionView from '@/views/admin/PermissionView.vue'
import PlaceholderView from '@/views/placeholder/PlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: WorkbenchView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/permissions',
      name: 'permissions',
      component: PermissionView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/placeholder',
      name: 'placeholder',
      component: PlaceholderView,
    },
  ],
})

/** 导航守卫：认证 + 垂直越权防护 */
router.beforeEach((to, from, next) => {
  let auth
  try {
    const raw = localStorage.getItem('cnaps_auth')
    if (raw) auth = JSON.parse(raw)
  } catch {}
  const isAuthenticated = !!(auth?.token)

  // 需要认证的页面
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // 需要 admin 角色的页面（垂直越权防护）
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) return next('/login')
    if (auth?.user?.role !== 'admin') return next('/workbench')
  }

  // 已登录用户访问登录页，直接跳工作台
  if (to.path === '/login' && isAuthenticated) {
    return next('/workbench')
  }

  next()
})

export default router
