<script setup>
// ================================
// Imports
// ================================
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, formActionDefault, supabase } from '@/utils/supabase'
import { getAvatarText } from '@/utils/helpers'

// ================================
// Router Instance
// ================================
const router = useRouter()

// ================================
// State Variables
// ================================
const drawer = ref(true)
const menuVisible = ref(false)
const isLoggedin = ref()
const formAction = ref({ ...formActionDefault })

const userData = ref({
  initials: '',
  email: '',
  fullname: '',
  role: '',
})

// ================================
// Menu Items for Sidebar
// ================================
const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/dashboard',
  },
  {
    title: 'Equipment',
    icon: 'mdi-dump-truck',
    children: [
      { title: 'All Equipment', route: '/equipment' },
      { title: 'Add Equipment', route: '/equipment/add' },
    ],
  },
  {
    title: 'Drivers',
    icon: 'mdi-account',
    children: [
      { title: 'All Drivers', route: '/driver' },
      { title: 'Add Driver', route: '/driver/add' },
    ],
  },
  {
    title: 'Requests',
    icon: 'mdi-message-plus',
    children: [
      { title: 'All Requests', route: '/request' },
      { title: 'New Request', route: '/request/new' },
      { title: 'Request History', route: '/request/history' },
    ],
  },
]

// ================================
// Functions
// ================================

// Check Authentication Status
const getLoggedStatus = async () => {
  isLoggedin.value = await isAuthenticated()
  if (!isLoggedin.value) {
    router.replace('/') // Redirect to login if the user is not authenticated
  }
}

// Get Current User Information
const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }

  if (data?.user) {
    const metadata = data.user.user_metadata || {}
    const firstname = metadata.firstname || ''
    const lastname = metadata.lastname || ''
    const role = metadata.role || ''

    userData.value.email = metadata.email || data.user.email || ''
    userData.value.fullname = `${firstname} ${lastname}`.trim()
    userData.value.initials = getAvatarText(userData.value.fullname || 'User')
    userData.value.role = role
  }
}

// Logout User
const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout: ', error)
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}

// ================================
// Lifecycle Hooks
// ================================
onMounted(() => {
  getLoggedStatus()
  getUser()
})
</script>

<template>
  <v-app class="bg-blue-lighten-5">
    <!-- ================================
         App Bar (Top Navigation)
         ================================ -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="3"
      class="px-4 d-flex align-center justify-space-between"
    >
      <!-- Left Side -->
      <div class="d-flex align-center gap-3">
        <v-app-bar-nav-icon variant="text" @click="drawer = !drawer" />
        <v-toolbar-title class="text-h6 font-weight-bold"> Dashboard </v-toolbar-title>
      </div>

      <!-- Right Side (User Avatar with Menu) -->
      <div class="ml-auto">
        <v-menu v-model="menuVisible" offset-y transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar size="50" color="primary" class="elevation-1 text-white font-weight-bold">
                {{ userData.initials }}
              </v-avatar>
            </v-btn>
          </template>

          <v-card class="pa-4" width="250">
            <!-- User Info -->
            <div class="d-flex align-center mb-4">
              <v-avatar size="50" color="primary" class="mr-3 text-white font-weight-bold">
                {{ userData.initials }}
              </v-avatar>
              <div>
                <div class="text-subtitle-3 font-weight-bold">{{ userData.fullname }}</div>
                <div class="text-subtitle-2 font-weight-medium">{{ userData.email }}</div>
                <div class="text-subtitle-2 font-weight-medium">{{ userData.role }}</div>
              </div>
            </div>

            <v-divider />

            <!-- Account Settings Button -->
            <v-btn
              block
              class="mt-4"
              color="blue-darken-1"
              @click="router.push('/account-settings')"
            >
              <v-icon left>mdi-account-cog</v-icon> Account Settings
            </v-btn>

            <!-- Logout Button -->
            <v-btn
              block
              class="mt-4"
              color="red-darken-1"
              @click="onLogout"
              :loading="formAction.formProcess"
              :disabled="formAction.formProcess"
            >
              <v-icon left>mdi-logout</v-icon> Logout
            </v-btn>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- ================================
         Navigation Drawer (Sidebar)
         ================================ -->
    <v-navigation-drawer
      app
      v-model="drawer"
      class="bg-gradient-to-b from-blue lighten-4 to-indigo lighten-4 elevation-8 rounded-lg"
      width="230"
    >
      <v-list dense>
        <template v-for="item in menuItems" :key="item.title">
          <!-- List with Children -->
          <v-list-group v-if="item.children" :prepend-icon="item.icon" color="primary">
            <template #activator="{ props }">
              <v-list-item v-bind="props" class="px-4 py-3">
                <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <!-- Child Menu Items -->
            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.route"
              link
              class="pl-10"
              active-class="bg-blue-dark text-blue"
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <!-- Single List Item -->
          <v-list-item
            v-else
            :to="item.route"
            link
            class="my-1 px-4 py-3 transition-all duration-200 ease-in-out hover:bg-blue-darken-3"
            active-class="bg-blue-dark text-blue"
          >
            <div class="d-flex align-center gap-3">
              <v-icon color="primary" class="text-h5">{{ item.icon }}</v-icon>
              <span class="px-2 text-body-1 font-weight-medium">{{ item.title }}</span>
            </div>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- ================================
         Main Content Area
         ================================ -->
    <v-main>
      <v-container fluid>
        <slot />
        <!-- OR: <router-view /> -->
      </v-container>
    </v-main>

    <!-- ================================
         Footer
         ================================ -->
    <v-footer app color="primary" class="text-center white--text py-3 d-flex justify-center">
      <span>&copy; {{ new Date().getFullYear() }} CGB - Motorpol System. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>
