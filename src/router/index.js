import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import DriverView from '@/views/system/driver/DriverView.vue'
import EquipmentView from '@/views/system/equipment/EquipmentView.vue'
import DriverForm from '@/views/system/driver/DriverForm.vue'
import RequestView from '@/views/system/RequestView.vue'
import EditDriverForm from '@/views/system/driver/EditDriverForm.vue'
import EquipmentForm from '@/views/system/equipment/EquipmentForm.vue'
import EditEquipmentForm from '@/views/system/equipment/EditEquipmentForm.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth Pages
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
    // System Pages
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    // For driver
    {
      path: '/driver',
      name: 'ListDriver',
      component: DriverView,
    },
    {
      path: '/driver/add',
      name: 'AddDriver',
      component: DriverForm,
    },
    {
      path: '/driver/edit/:id',
      name: 'EditDriver',
      component: EditDriverForm,
      props: true,
    },
    // For Vehicle
    {
      path: '/equipment',
      name: 'ListEquipment',
      component: EquipmentView,
    },
    {
      path: '/equipment/add',
      name: 'AddEquipment',
      component: EquipmentForm,
    },
    {
      path: '/equipment/edit/:id',
      name: 'EditEquipment',
      component: EditEquipmentForm,
    },
    // For Request
    {
      path: '/request',
      name: 'request',
      component: RequestView,
    },
    // Errors Pages
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
  ],
})

export default router
