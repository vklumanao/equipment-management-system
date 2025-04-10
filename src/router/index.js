import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import Register from '@/views/auth/RegisterView.vue'

const routes = [
  {path: '/login', component : LoginView},
  {path: '/register', component : Register},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
  ],
})

export default router
