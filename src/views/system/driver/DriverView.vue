<script setup>
// ==================
// Imports
// ==================
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

// ================================
// Router Instance
// ================================
const router = useRouter()

// ==================
// Table Headers (for Data Table)
// ==================
const tableTitles = [
  { title: 'Full Name', align: 'start', key: 'full_name' },
  { title: 'License Number', align: 'start', key: 'license_number' },
  { title: 'License Expiry', align: 'start', key: 'license_expiry' },
  { title: 'Years of Experience', align: 'start', key: 'experience_year' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Action', align: 'start', key: 'action' },
  { title: 'Details', align: 'start', key: 'details' },
]

// ==================
// Reactive Variables
// ==================
const drivers = ref([]) // List of drivers from database
const isDeleteDialogOpen = ref(false) // Control for delete confirmation modal
const driverToDelete = ref(null) // Selected driver to delete

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

// Refresh the data (re-fetch)
const refreshData = () => {
  fetchDrivers()
}

// Open the delete confirmation dialog
const askDeleteDriver = (driverName) => {
  driverToDelete.value = driverName
  isDeleteDialogOpen.value = true
}

// Confirm and delete the driver
const confirmDeleteDriver = async () => {
  if (!driverToDelete.value) return

  const { error } = await supabase.from('drivers').delete().eq('full_name', driverToDelete.value)
  if (error) {
    console.error('Error deleting driver:', error.message)
    // You can show an alert here if needed
  } else {
    refreshData()
  }

  isDeleteDialogOpen.value = false
  driverToDelete.value = null
}

// Navigate to Edit Driver Form with driver's ID
const editDriver = (id) => {
  router.push(`/driver/edit/${id}`)
}

// View driver details
const viewDetails = (driver) => {
  console.log('View details:', driver)
}

// ==================
// Lifecycle Hooks
// ==================

// On page mount, automatically fetch drivers
onMounted(() => {
  fetchDrivers()
})
</script>

<template>
  <DashboardLayout>
    <div class="pa-0">
      <!-- ====================
           Add Driver Button Section
           ==================== -->
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

      <!-- ====================
           Drivers Data Table Section
           ==================== -->
      <div class="table-container">
        <v-data-table-virtual
          :headers="tableTitles"
          :items="drivers"
          height="600"
          item-value="full_name"
          fixed-header
          class="elevation-1"
        >
          <!-- Title Column -->
          <template v-slot:headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" class="text-start font-weight-bold">
                {{ column.title }}
              </th>
            </tr>
          </template>

          <!-- Status Column -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'Active' ? 'green' : 'red'" class="text-white" small>
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Action Buttons (Edit/Delete) Column -->
          <template v-slot:item.action="{ item }">
            <div class="d-flex align-center" style="gap: 6px">
              <v-btn @click="editDriver(item.id)" color="blue" icon size="x-small">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="askDeleteDriver(item.full_name)" color="red" icon size="x-small">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <!-- Details Button Column -->
          <template v-slot:item.details="{ item }">
            <v-btn @click="viewDetails(item.name)" color="green" icon size="x-small">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
          </template>

          <!-- Table Toolbar (Title + Refresh) -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="text-h6">Driver Information</v-toolbar-title>
              <v-btn icon @click="refreshData">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table-virtual>

        <!-- ====================
             Delete Confirmation Modal
             ==================== -->
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
