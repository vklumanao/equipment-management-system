import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, getUserInformation } from '@/utils/supabase'
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
      path: '/home',
      name: 'home',
    },

    {
      path: '/login',
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
      path: '/system/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    // For driver
    {
      path: '/system/driver',
      name: 'ListDriver',
      component: DriverView,
    },
    {
      path: '/system/driver/add',
      name: 'AddDriver',
      component: DriverForm,
    },
    {
      path: '/system/driver/edit/:id',
      name: 'EditDriver',
      component: EditDriverForm,
      props: true,
    },
    // For Vehicle
    {
      path: '/system/equipment',
      name: 'ListEquipment',
      component: EquipmentView,
    },
    {
      path: '/system/equipment/add',
      name: 'AddEquipment',
      component: EquipmentForm,
    },
    {
      path: '/system/equipment/edit/:id',
      name: 'EditEquipment',
      component: EditEquipmentForm,
    },
    // For Request
    {
      path: '/system/request',
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

router.beforeEach(async (to) => {
  // Check if the user is currently authenticated (via Supabase)
  const isLoggedIn = await isAuthenticated()
  const userMetadata = await getUserInformation()

  const isAdmin = userMetadata?.isAdmin === true

  // If the user is trying to access '/home'
  // Redirect to dashboard if logged in, otherwise redirect to login
  if (to.name === 'home') {
    return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
  }

  // If the user is already logged in and tries to access login or register pages,
  // redirect them to the dashboard to prevent access to auth pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }

  // Check if the user is logged in and not an admin
  if (isLoggedIn && !isAdmin) {
    // Check if the user is trying to access a system route
    if (to.path.startsWith('/system')) {
      // If they are, redirect them to the forbidden page
      return { name: 'forbidden' }
    }
  }

  // If the user is not logged in and tries to access a protected /system route,
  // redirect them to the login page
  if (!isLoggedIn && to.path.startsWith('/system')) {
    return { name: 'login' }
  }

  // If the route does not match any defined route (404),
  // redirect to a not-found error page
  if (router.resolve(to).matched.length === 0) {
    return { name: 'not-found' }
  }
})

export default router
