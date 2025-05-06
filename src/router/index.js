import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, getUserInformation } from '@/utils/supabase'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import DriverView from '@/views/system/admin-management/driver-management/DriverView.vue'
import EquipmentView from '@/views/system/admin-management/equipment-management/EquipmentView.vue'
import DriverForm from '@/views/system/admin-management/driver-management/DriverForm.vue'
import RequestView from '@/views/system/request/RequestView.vue'
import RequestForm from '@/views/system/request/RequestForm.vue'
import EditRequestForm from '@/views/system/request/EditRequestForm.vue'
import EditDriverForm from '@/views/system/admin-management/driver-management/EditDriverForm.vue'
import EquipmentForm from '@/views/system/admin-management/equipment-management/EquipmentForm.vue'
import EditEquipmentForm from '@/views/system/admin-management/equipment-management/EditEquipmentForm.vue'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import EditUserForm from '@/views/system/user-information/EditUserForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Root path: redirect logic will handle whether to go to login or dashboard
    {
      path: '/',
      name: 'home',
      component: LoginView,
      meta: { outsiderOnly: true }, // Only accessible to users not logged in
    },

    // Login page
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        outsiderOnly: true, // Prevent access if already logged in
      },
    },

    // Registration page
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        outsiderOnly: true, // Prevent access if already logged in
      },
    },

    // System dashboard (for admins only)
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true, // User must be logged in
        requiresAdmin: true, // User must be an admin
      },
    },

    {
      path: '/user-settings',
      name: 'user-settings',
      component: EditUserForm,
      meta: {
        requiresAuth: true,
      },
    },

    // List all drivers
    {
      path: '/driver',
      name: 'ListDriver',
      component: DriverView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // Add new driver
    {
      path: '/driver/add',
      name: 'AddDriver',
      component: DriverForm,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // Edit driver (uses dynamic route `:id`)
    {
      path: '/driver/edit/:id',
      name: 'EditDriver',
      component: EditDriverForm,
      props: true, // Route param `id` will be passed as a prop
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // List all equipment/vehicles
    {
      path: '/equipment',
      name: 'ListEquipment',
      component: EquipmentView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // Add new equipment
    {
      path: '/equipment/add',
      name: 'AddEquipment',
      component: EquipmentForm,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // Edit existing equipment (uses dynamic route `:id`)
    {
      path: '/equipment/edit/:id',
      name: 'EditEquipment',
      component: EditEquipmentForm,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // View requests
    {
      path: '/request',
      name: 'RequestView',
      component: RequestView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },

    // Forbidden page (shown when user tries to access unauthorized content)
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: {
        title: 'Forbidden',
      },
    },
    {
      path: '/request/add',
      name: 'AddRequest',
      component: RequestForm,
    },
    {
      path: '/request/edit/:id',
      name: 'EditRequest',
      component: EditRequestForm,
    },
  ],
})

router.beforeEach(async (to) => {
  // Check if the user is logged in using Supabase session
  const isLoggedIn = await isAuthenticated()

  // If the route is meant only for outsiders (not logged-in users),
  // and the user is already logged in, redirect them to the dashboard.
  if (to.meta.outsiderOnly && isLoggedIn) {
    return { name: 'dashboard' }
  }

  // If the route requires authentication and the user is not logged in,
  // redirect them to the login page.
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  // If the route requires admin access and the user is logged in,
  // check if the user has admin privileges; if not, redirect to forbidden page.
  if (to.meta.requiresAdmin && isLoggedIn) {
    const userMetadata = await getUserInformation()
    if (!userMetadata?.isAdmin) {
      return { name: 'forbidden' }
    }
  }

  // If no route matches the requested path, redirect to a 404 not-found page.
  if (router.resolve(to).matched.length === 0) {
    return { name: 'not-found' }
  }
})

export default router
