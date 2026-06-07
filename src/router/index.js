import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/login/LoginView.vue'
import WorkbenchView from '@/views/workbench/WorkbenchView.vue'

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
    },
  ],
})

export default router

