<script setup>
// ==================
// Imports
// ==================
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

// ==================
// Router Instance
// ==================
const router = useRouter()

// ==================
// Table Headers (for Data Table)
// ==================
const tableTitles = [
  { title: 'No.', key: 'row_number', align: 'center' },
  { title: 'Full Name', key: 'full_name', align: 'start' },
  { title: 'License Number', key: 'license_number', align: 'start' },
  { title: 'License Expiry', key: 'license_expiry', align: 'start' },
  { title: 'Years of Experience', key: 'experience_year', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center' },
]

// ==================
// Reactive Variables
// ==================
const drivers = ref([])
const isDeleteDialogOpen = ref(false)
const driverToDelete = ref(null)

// ==================
// Functions
// ==================

// Fetch drivers from Supabase
const fetchDrivers = async () => {
  const { data, error } = await supabase.from('drivers').select('*')
  if (error) {
    console.error('Error fetching drivers:', error.message)
  } else {
    drivers.value = data
  }
}

// Refresh Data
const refreshData = () => {
  fetchDrivers()
}

// Open Delete Dialog
const askDeleteDriver = (driver) => {
  driverToDelete.value = driver
  isDeleteDialogOpen.value = true
}

// Confirm Delete
const confirmDeleteDriver = async () => {
  if (!driverToDelete.value) return

  const { error } = await supabase.from('drivers').delete().eq('id', driverToDelete.value.id)
  if (error) {
    console.error('Error deleting driver:', error.message)
  } else {
    refreshData()
  }

  isDeleteDialogOpen.value = false
  driverToDelete.value = null
}

// Edit Driver
const editDriver = (id) => {
  router.push(`/driver/edit/${id}`)
}

// View Details
// const viewDetails = (driver) => {
//   console.log('View details:', driver)
// }

// On mount
onMounted(() => {
  fetchDrivers()
})

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Drivers', disabled: true, href: '/driver' }, // Current Page
])
</script>

<template>
  <DashboardLayout>
    <div class="pa-4">
      <!-- Header and Add Button -->
      <div class="d-flex justify-space-between align-center mb-0">
        <!-- ================================
           Breadcrumbs
           ================================ -->
        <v-breadcrumbs :items="breadcrumbs" class="mb-0">
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>

          <template #item="{ item }">
            <v-breadcrumbs-item
              :to="!item.disabled ? item.href : undefined"
              :disabled="item.disabled"
              link
            >
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <RouterLink to="/driver/add" style="text-decoration: none">
          <v-btn color="primary" prepend-icon="mdi-account-plus" elevation="2"> Add Driver </v-btn>
        </RouterLink>
      </div>

      <!-- Driver Data Table -->
      <v-card flat elevation="2">
        <v-data-table
          :headers="tableTitles"
          :items="drivers"
          item-value="id"
          class="rounded-lg"
          height="600"
          fixed-header
        >
          <!-- Row Number Column -->
          <template v-slot:item.row_number="{ index }">
            {{ index + 1 }}
          </template>

          <!-- Status Column -->
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Active' ? 'success' : 'error'"
              text-color="white"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Actions Column -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center align-center" style="gap: 8px">
              <v-btn icon size="small" color="blue" @click="editDriver(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="red" @click="askDeleteDriver(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <!-- <v-btn icon size="small" color="green" @click="viewDetails(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn> -->
            </div>
          </template>

          <!-- Top Toolbar -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Driver Information</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="refreshData">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="isDeleteDialogOpen" max-width="400px">
        <v-card class="pa-4">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon color="error" class="mr-2">mdi-alert</v-icon>
            Confirm Deletion
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete
            <strong>{{ driverToDelete?.full_name }}</strong
            >?
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey" @click="isDeleteDialogOpen = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDeleteDriver">Yes, Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.v-data-table {
  background-color: #ffffff;
}

.v-card {
  border-radius: 12px;
}

.v-toolbar-title {
  font-weight: bold;
}

.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
