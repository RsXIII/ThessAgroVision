
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../components/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'fields',
        name: 'Fields',
        component: () => import('../views/Fields.vue')
      },
      {
        path: 'weather',
        name: 'Weather',
        component: () => import('../views/Weather.vue')
      },
      {
        path: 'crops',
        name: 'Crops',
        component: () => import('../views/Crops.vue')
      },
      {
        path: 'irrigation',
        name: 'Irrigation',
        component: () => import('../views/Irrigation.vue')
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../views/Analytics.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
