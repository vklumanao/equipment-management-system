<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'

const cardData = ref([
  {
    icon: 'mdi-dump-truck',
    color: 'primary',
    title: 'Vehicle',
    value: '1,245',
  },
  {
    icon: 'mdi-account',
    color: 'green',
    title: 'Driver',
    value: '87',
  },
  {
    icon: 'mdi-message-plus',
    color: 'yellow',
    title: 'Request',
    value: '$4,390',
  },
])
</script>

<template>
  <DashboardLayout>
    <v-row>
      <v-col v-for="(item, index) in cardData" :key="index" cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-icon :color="item.color" large size="52px">{{ item.icon }}</v-icon>
          <div class="text-h6 mt-2">{{ item.title }}</div>
          <div class="text-subtitle-1">{{ item.value }}</div>
        </v-card>
      </v-col>
    </v-row>
  </DashboardLayout>
</template>

<style scoped></style>
