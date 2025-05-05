<script setup>
// ================================
// Imports
// ================================
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, formActionDefault, supabase, getUserInformation } from '@/utils/supabase'
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
  avatar_url: '',
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
      { title: 'New Request', route: '/request/add' },
    ],
  },
  {
    title: 'User Settings',
    icon: 'mdi-cog',
    route: '/user-settings',
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
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.firstname + ' ' + metadata.lastname
  userData.value.initials = getAvatarText(userData.value.fullname)
  userData.value.role = metadata.role
  userData.value.avatar_url = metadata.avatar_url || ''
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
  router.replace('/login')
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
        <div>
          <v-img src="/images/logo.png" width="45" height="45" />
        </div>
        <v-toolbar-title class="font-weight-bold mx-2"> CGB - Motorpol System </v-toolbar-title>
      </div>

      <!-- Right Side (User Avatar with Menu) -->
      <div class="ml-auto">
        <v-menu v-model="menuVisible" offset-y transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar size="50" color="primary"  class="elevation-1 text-white font-weight-bold">
               <img v-if="userData.avatar_url" :src="userData.avatar_url"  style="width: 100%; height: 100%; object-fit: cover"> 
               <span v-else >{{  userData.initials }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card class="pa-4" width="300">
            <!-- User Info -->
            <div
              class="d-flex align-center gap-6 pa-4 rounded-lg elevation-1 bg-grey-lighten-5 mb-6"
            >
              <v-avatar
                size="56"
                color="primary"
                class="text-white font-weight-bold elevation-2 mr-2"
              >
              <img v-if="userData.avatar_url" :src="userData.avatar_url"  style="width: 100%; height: 100%; object-fit: cover"> 
              <span v-else >{{  userData.initials }}</span>
              </v-avatar>

              <div class="d-flex flex-column justify-center">
                <div class="font-weight-semibold text-grey-darken-4">
                  {{ userData.fullname }}
                </div>
                <div class="text-grey-darken-1">
                  {{ userData.email }}
                </div>
                <div class="text-grey-darken-1">
                  {{ userData.role }}
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Account Settings Button -->
            <v-btn block class="mt-4" color="blue-darken-1" @click="router.push('/user-settings')">
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
    <v-navigation-drawer app v-model="drawer" class="elevation-8" width="250">
      <v-list dense>
        <template v-for="item in menuItems" :key="item.title">
          <!-- List with Children -->
          <v-list-group v-if="item.children" color="primary">
            <template #activator="{ props }">
              <v-list-item v-bind="props" class="px-6 py-4">
                <div class="d-flex align-center">
                  <v-icon size="36" color="primary" class="me-2">{{ item.icon }}</v-icon>
                  <v-list-item-title class="font-weight-medium mb-0">
                    {{ item.title }}
                  </v-list-item-title>
                </div>
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
            class="my-1 px-6 py-3 transition-all duration-200 ease-in-out hover:bg-blue-darken-3"
            active-class="bg-blue-dark text-blue"
          >
            <div class="d-flex align-center gap-3">
              <v-icon size="36" color="primary">{{ item.icon }}</v-icon>
              <span class="px-2 font-weight-medium">{{ item.title }}</span>
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
