import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/oauth2/authorize',
      name: 'authorize',
      component: () => import('../views/AuthorizeView.vue')
    },
    {
      path: '/auth/callback',
      name: 'callback',
      component: () => import('../views/Callback.vue')
    },
    {
      path: '/applications',
      name: 'applications',
      component: () => import('../views/application/HomeView.vue')
    },
    {
      path: '/applications/list',
      name: 'applications-list',
      component: () => import('../views/application/ListView.vue')
    },
    {
      path: '/applications/:id',
      name: 'applications-info',
      component: () => import('../views/application/InfoView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/Test.vue')
    }
  ]
})

export default router
