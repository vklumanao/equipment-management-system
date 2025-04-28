<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { supabase } from '@/utils/supabase'

const tableTitles = [
  { title: 'Full Name', align: 'start', key: 'full_name' },
  { title: 'License Number', align: 'start', key: 'license_number' },
  { title: 'License Expiry', align: 'start', key: 'license_expiry' },
  { title: 'Years of Experience', align: 'start', key: 'experience_year' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Action', align: 'start', key: 'action' },
  { title: 'Details', align: 'start', key: 'details' },
]

const drivers = ref([])

// Fetch drivers from database
const fetchDrivers = async () => {
  const { data, error } = await supabase.from('drivers').select('*')
  if (error) {
    console.error('Error fetching drivers:', error.message)
  } else {
    drivers.value = data
  }
}

// Refresh button
const refreshData = () => {
  fetchDrivers()
}

// onMounted para automatic kuhaon ang data pag load sa page
onMounted(() => {
  fetchDrivers()
})

// Example handlers (optional): editDriver, deleteDriver, viewDetails
const editDriver = (driver) => {
  console.log('Edit driver:', driver)
}

// For Modal
const isDeleteDialogOpen = ref(false)
const driverToDelete = ref(null)

const askDeleteDriver = (driverName) => {
  driverToDelete.value = driverName
  isDeleteDialogOpen.value = true
}

const confirmDeleteDriver = async () => {
  if (!driverToDelete.value) return

  const { error } = await supabase.from('drivers').delete().eq('full_name', driverToDelete.value)

  if (error) {
    console.error('Error deleting driver:', error.message)
    // alert('Failed to delete driver.')
  } else {
    // alert('Driver deleted successfully.')
    refreshData()
  }

  isDeleteDialogOpen.value = false
  driverToDelete.value = null
}

const viewDetails = (driver) => {
  console.log('View details:', driver)
}
</script>

<template>
  <DashboardLayout>
    <div class="pa-0">
      <!-- Button Section -->
      <div class="mb-6 d-flex justify-start align-center">
        <RouterLink to="/driver/add" style="text-decoration: none">
          <v-btn
            color=""
            prepend-icon="mdi-account-circle"
            class="d-flex align-center"
            elevation="2"
            style="text-transform: none; font-weight: bold"
          >
            <template v-slot:prepend>
              <v-icon color="success" class="mr-2"></v-icon>
            </template>
            Add Driver
            <template v-slot:append>
              <v-icon color="warning" class="ml-2"></v-icon>
            </template>
          </v-btn>
        </RouterLink>
      </div>

      <!-- Data Table Section -->
      <div class="table-container">
        <v-data-table-virtual
          :headers="tableTitles"
          :items="drivers"
          height="600"
          item-value="full_name"
          fixed-header
          class="elevation-1"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Active' ? 'green' : 'red'" class="text-white" small>
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap: 6px">
              <v-btn @click="editDriver(item.name)" color="blue" icon size="x-small">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="askDeleteDriver(item.full_name)" color="red" icon size="x-small">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <template v-slot:item.details="{ item }">
            <v-btn @click="viewDetails(item.name)" color="green" icon size="x-small">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="text-h6">Driver Information</v-toolbar-title>
              <v-btn icon @click="refreshData">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table-virtual>

        <!-- Confirmation for deletion -->
        <v-dialog v-model="isDeleteDialogOpen" max-width="400px">
          <v-card>
            <v-card-title class="text-h6">Confirm Deletion</v-card-title>
            <v-card-text>
              Are you sure you want to delete <strong>{{ driverToDelete }}</strong
              >?
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="grey" text @click="isDeleteDialogOpen = false">Cancel</v-btn>
              <v-btn color="red" text @click="confirmDeleteDriver">Yes, Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.v-data-table-virtual {
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 100%;
}

.table-container {
  max-width: 100%;
  overflow-x: auto;
}

.v-btn {
  transition: transform 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

.v-toolbar-title {
  font-weight: bold;
}
</style>
