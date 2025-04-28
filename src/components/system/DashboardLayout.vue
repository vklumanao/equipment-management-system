<script setup>
import { onMounted, ref } from 'vue'
import { isAuthenticated } from '@/utils/supabase'

const drawer = ref(true)

// Load Variables
const isLoggedin = ref()

// Load Authentication status from supabase
const getLoggedStatus = async () => {
  isLoggedin.value = await isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => {
  getLoggedStatus()
})

const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/dashboard',
  },
  {
    title: 'Vehicles',
    icon: 'mdi-dump-truck',
    children: [
      { title: 'All Vehicles', route: '/vehicle' },
      { title: 'Add Vehicle', route: '/vehicle/add' },
      { title: 'Vehicle Types', route: '/vehicle/types' },
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
</script>

<template>
  <v-app class="bg-blue-lighten-5">
    <!-- App Bar / Header -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="3"
      class="px-4 d-flex align-center justify-space-between"
    >
      <!-- Left side -->
      <div class="d-flex align-center gap-3">
        <v-app-bar-nav-icon variant="text" @click="drawer = !drawer" />
        <v-toolbar-title class="text-h6 font-weight-bold"> Dashboard </v-toolbar-title>
      </div>

      <!-- Right side (Avatar aligned to the edge) -->
      <v-avatar size="50" class="elevation-1 ml-auto">
        <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar" />
      </v-avatar>
    </v-app-bar>

    <!-- Navigation Drawer / Sidebar -->
    <v-navigation-drawer
      app
      v-model="drawer"
      class="bg-gradient-to-b from-blue lighten-4 to-indigo lighten-4 elevation-8 rounded-lg"
      width="230"
    >
      <v-list dense>
        <template v-for="item in menuItems" :key="item.title">
          <!-- If item has children, show dropdown -->
          <v-list-group v-if="item.children" :prepend-icon="item.icon" color="primary">
            <template #activator="{ props }">
              <v-list-item v-bind="props" class="px-4 py-3">
                <v-list-item-title class="font-weight-medium">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <!-- Child items -->
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

          <!-- If no children, render normal item -->
          <v-list-item
            v-else
            :to="item.route"
            link
            class="my-1 px-4 py-3 transition-all duration-200 ease-in-out hover:bg-blue-darken-3"
            active-class="bg-blue-dark text-blue"
          >
            <div class="d-flex align-center gap-3">
              <v-icon color="primary" class="text-h5">
                {{ item.icon }}
              </v-icon>
              <span class="px-2 text-body-1 font-weight-medium">
                {{ item.title }}
              </span>
            </div>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <slot />
        <!-- OR -->
        <!-- <router-view /> -->
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="primary" class="text-center white--text py-3">
      <span>&copy; 2025 CGB Motorpol System. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<style scoped></style>
