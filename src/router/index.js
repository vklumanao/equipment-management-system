import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import DriverView from '@/views/system/DriverView.vue'
import VehicleView from '@/views/system/VehicleView.vue'
import DriverForm from '@/views/system/driver/DriverForm.vue'
import RequestView from '@/views/system/RequestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    // For driver
    {
      path: '/driver',
      name: 'driver-list',
      component: DriverView,
    },
    {
      path: '/driver/add',
      name: 'driver-add',
      component: DriverForm,
    },
    // For Vehicle
    {
      path: '/vehicle',
      name: 'vehicle',
      component: VehicleView,
    },
    // For Request
    {
      path: '/request',
      name: 'request',
      component: RequestView,
    },
  ],
})

export default router
