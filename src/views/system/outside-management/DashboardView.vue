<script setup>
// Imports
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import { supabase, getUserInformation } from '@/utils/supabase'

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

// Function to fetch request count from Supabase
// const fetchRequestCount = async () => {
//   const { data, count, error } = await supabase
//     .from('requests')
//     .select('*', { count: 'exact', head: true }) // Only fetch count, no actual data

//   if (error) {
//     console.error('Error fetching requests count:', error)
//     return
//   }

//   // Find the Request card and update its value
//   const requestCard = cardData.value.find((card) => card.title === 'Request')
//   if (requestCard) {
//     requestCard.value = count
//   }
// }

const userData = ref({
  email: '',
  fullname: '',
})

// Get Current User Information
const getUser = async () => {
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.firstname + ' ' + metadata.lastname
  userData.value.initials = getAvatarText(userData.value.fullname)
  userData.value.role = role
}

// Lifecycle hook: Fetch driver count when component is mounted
onMounted(() => {
  fetchDriverCount()
  fetchEquipmentCount()
  // fetchRequestCount()
  getUser()
})
</script>

<template>
  <DashboardLayout>
    <!-- Welcome Manager Card -->
    <v-card
      class="mb-6 pa-6 rounded-2xl"
      elevation="4"
      style="
        border-radius: 20px;
        background-color: #f9fafb;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
      "
    >
      <div class="d-flex align-center justify-space-between">
        <div>
          <h2 class="font-weight-bold mb-2">
            Welcome,
            <span
              class="px-3 py-1 bg-blue-lighten-5 text-primary rounded-pill font-weight-semibold"
            >
              {{ userData.fullname }}
            </span>
            👋
          </h2>
          <p class="text-grey-darken-1">Here’s a quick overview of the system activity.</p>
        </div>
        <div
          class="rounded-circle d-flex align-center justify-center"
          style="width: 60px; height: 60px; background-color: var(--v-theme-primary-lighten5)"
        >
          <v-icon size="36" color="primary">mdi-account-tie</v-icon>
        </div>
      </div>
    </v-card>

    <!-- Dashboard Stats Cards -->
    <v-row>
      <v-col v-for="(item, index) in cardData" :key="index" cols="12" sm="6" md="4">
        <v-card
          class="pa-6 rounded-2xl"
          elevation="4"
          style="
            border-radius: 20px;
            background-color: #f9fafb;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            transition: all 0.3s ease;
          "
        >
          <div class="d-flex align-center mb-4">
            <div
              class="rounded-circle d-flex align-center justify-center"
              :style="{
                width: '60px',
                height: '60px',
                backgroundColor: `var(--v-theme-${item.color}-lighten5)`,
              }"
            >
              <v-icon :color="item.color" size="60">{{ item.icon }}</v-icon>
            </div>
          </div>

          <div
            class="text-grey mb-1 font-weight-medium text-uppercase tracking-widest"
            style="font-size: 24px"
          >
            {{ item.title }}
          </div>
          <div class="font-weight-bold text-black mb-2" style="font-size: 2rem">
            {{ item.value }}
          </div>

          <v-progress-linear
            :color="item.color"
            height="10"
            rounded
            background-color="grey-lighten-3"
            value="100"
            class="shadow-sm"
          />
        </v-card>
      </v-col>
    </v-row>
  </DashboardLayout>
</template>

<style scoped></style>
