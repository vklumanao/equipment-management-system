<script setup>
import { ref } from 'vue'

const drawer = ref(true)

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { title: 'Vehicles', icon: 'mdi-dump-truck', route: '/vehicle' },
  { title: 'Drivers', icon: 'mdi-account', route: '/driver' },
  { title: 'Requests', icon: 'mdi-message-plus', route: '/request' },
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
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
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
  </v-app>
</template>

<style scoped></style>
