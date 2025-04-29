<script setup>
// Imports
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { supabase } from '@/utils/supabase'

// Reactive array for dashboard cards
const cardData = ref([
  {
    icon: 'mdi-dump-truck',
    color: 'primary',
    title: 'Equipment',
    value: '0',
  },
  {
    icon: 'mdi-account',
    color: 'green',
    title: 'Driver',
    value: '0',
  },
  {
    icon: 'mdi-message-plus',
    color: 'yellow',
    title: 'Request',
    value: '0',
  },
])

// Function to fetch driver count from Supabase
const fetchDriverCount = async () => {
  const { data, count, error } = await supabase
    .from('drivers')
    .select('*', { count: 'exact', head: true }) // Only fetch count, no actual data

  if (error) {
    console.error('Error fetching drivers count:', error)
    return
  }

  // Find the Driver card and update its value
  const driverCard = cardData.value.find((card) => card.title === 'Driver')
  if (driverCard) {
    driverCard.value = count
  }
}

// Function to fetch equipment count from Supabase
const fetchEquipmentCount = async () => {
  const { data, count, error } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true }) // Only fetch count, no actual data

  if (error) {
    console.error('Error fetching equipments count:', error)
    return
  }

  // Find the Equipment card and update its value
  const equipmentCard = cardData.value.find((card) => card.title === 'Equipment')
  if (equipmentCard) {
    equipmentCard.value = count
  }
}

// Lifecycle hook: Fetch driver count when component is mounted
onMounted(() => {
  fetchDriverCount()
  fetchEquipmentCount()
})
</script>

<template>
  <DashboardLayout>
    <v-row>
      <!-- Loop through cardData to render each card -->
      <v-col v-for="(item, index) in cardData" :key="index" cols="12" md="4">
        <v-card class="pa-4" outlined>
          <!-- Icon -->
          <v-icon :color="item.color" large size="52px">
            {{ item.icon }}
          </v-icon>

          <!-- Title -->
          <div class="text-h6 mt-2">
            {{ item.title }}
          </div>

          <!-- Value -->
          <div class="text-subtitle-1">
            {{ item.value }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </DashboardLayout>
</template>

<style scoped></style>
