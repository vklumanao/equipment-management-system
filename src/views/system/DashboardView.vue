<script setup>
// Imports
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import { supabase, getUserInformation } from '@/utils/supabase'
import EquipmentAvailabilityChart from '@/components/charts/EquipmentAvailabilityChart.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive array for dashboard cards
const cardData = ref([
  {
    icon: 'mdi-dump-truck',
    color: 'primary',
    title: 'Equipment',
    value: '0',
    details: {
      active: '0',
      inactive: '0',
      crane: '0',
      forklift: '0',
      excavator: '0',
      truck: '0',
    },
  },
  {
    icon: 'mdi-account',
    color: 'green',
    title: 'Driver',
    value: '0',
    details: {
      active: '0',
      inactive: '0',
    },
  },
  {
    icon: 'mdi-message-plus',
    color: 'yellow',
    title: 'Request',
    value: '0',
    details: {
      pending: '0',
      approved: '0',
      rejected: '0',
    },
  },
])

// Function to fetch driver count from Supabase
const fetchDriverCount = async () => {
  const { count, error } = await supabase
    .from('drivers')
    .select('*', { count: 'exact', head: true })

  const { count: availableCount } = await supabase
    .from('drivers')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'active')

  const { count: unavailableCount } = await supabase
    .from('drivers')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'inactive')

  if (error) {
    console.error('Error fetching drivers count:', error)
    return
  }

  const driverCard = cardData.value.find((card) => card.title === 'Driver')
  if (driverCard) {
    driverCard.value = count
    driverCard.details = {
      active: availableCount || 0,
      inactive: unavailableCount || 0,
    }
  }
}

// Function to fetch equipment count from Supabase
const fetchEquipmentCount = async () => {
  // Total equipment
  const { count: totalCount, error: totalError } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })

  if (totalError) {
    console.error('Error fetching total equipment count:', totalError)
    return
  }

  // Active
  const { count: activeCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'active')

  // Inactive
  const { count: inactiveCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'inactive')

  // Crane
  const { count: craneCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('type', 'crane')

  // Forklift
  const { count: forkliftCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('type', 'forklift')

  // Excavator
  const { count: excavatorCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('type', 'excavator')

  // Excavator
  const { count: truckCount } = await supabase
    .from('equipments')
    .select('*', { count: 'exact', head: true })
    .ilike('type', 'truck')

  const equipmentCard = cardData.value.find((card) => card.title === 'Equipment')
  if (equipmentCard) {
    equipmentCard.value = totalCount
    equipmentCard.details = {
      active: activeCount || 0,
      inactive: inactiveCount || 0,
      crane: craneCount || 0,
      forklift: forkliftCount || 0,
      excavator: excavatorCount || 0,
      truck: truckCount || 0,
    }
  }
}

// Function to fetch request count from Supabase
const fetchRequestCount = async () => {
  const { count, error } = await supabase
    .from('equipment_requests')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('equipment_requests')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'pending')

  const { count: approvedCount } = await supabase
    .from('equipment_requests')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('equipment_requests')
    .select('*', { count: 'exact', head: true })
    .ilike('status', 'rejected')

  if (error) {
    console.error('Error fetching requests count:', error)
    return
  }

  const requestCard = cardData.value.find((card) => card.title === 'Request')
  if (requestCard) {
    requestCard.value = count
    requestCard.details = {
      pending: pendingCount || 0,
      approved: approvedCount || 0,
      rejected: rejectedCount || 0,
    }
  }
}

// Function to handle card clicks
const goToDetailsPage = (item) => {
  if (item.title === 'Equipment') {
    router.push('/equipment')
    console.log('Redirecting to Equipment page')
  } else if (item.title === 'Driver') {
    router.push('/driver')
    console.log('Redirecting to Driver page')
  } else if (item.title === 'Request') {
    router.push('/request')
    console.log('Redirecting to Request page')
  }
}

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
  fetchRequestCount()
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
        ></div>
      </div>
    </v-card>

    <!-- Dashboard Stats Cards -->
    <v-row>
      <v-col v-for="(item, index) in cardData" :key="index" cols="12" sm="6" md="4">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="pa-6 rounded-2xl"
            elevation="4"
            @click="goToDetailsPage(item)"
            :style="{
              borderRadius: '20px',
              backgroundColor: isHovering
                ? '#e3f2fd'
                : '#f9fafb' /* Change background color on hover */,
              boxShadow: isHovering
                ? '0 8px 24px rgba(0, 0, 0, 0.15)'
                : '0 8px 24px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s ease',
            }"
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

            <!-- Breakdown for Equipment -->
            <div v-if="item.title === 'Equipment'" class="mt-4 text-grey-darken-1">
              <div>Active: {{ item.details.active }}</div>
              <div>Inactive: {{ item.details.inactive }}</div>
              <div>Crane: {{ item.details.crane }}</div>
              <div>Forklift: {{ item.details.forklift }}</div>
              <div>Excavator: {{ item.details.excavator }}</div>
              <div>Truck: {{ item.details.truck }}</div>
            </div>

            <!-- Breakdown for Driver -->
            <div v-else-if="item.title === 'Driver'" class="mt-4 text-grey-darken-1">
              <div>Available: {{ item.details.active }}</div>
              <div>Unavailable: {{ item.details.inactive }}</div>
            </div>

            <v-progress-linear
              :color="item.color"
              height="10"
              rounded
              background-color="grey-lighten-3"
              value="100"
              class="shadow-sm mt-4"
            />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <EquipmentAvailabilityChart
          :active="Number(cardData.find((c) => c.title === 'Equipment')?.details.active)"
          :inactive="Number(cardData.find((c) => c.title === 'Equipment')?.details.inactive)"
        />
      </v-col>
    </v-row> -->
  </DashboardLayout>
</template>
