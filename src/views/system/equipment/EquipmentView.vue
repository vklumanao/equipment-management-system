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
const isLoading = ref(false)

// ==================
// Table Headers (for Data Table)
// ==================
const tableTitles = [
  { title: 'No.', key: 'row_number', align: 'center' },
  { title: 'Type', key: 'type', align: 'center' },
  { title: 'Model', key: 'model', align: 'center' },
  { title: 'Serial Number', key: 'serial_number', align: 'center' },
  { title: 'Purchase Date', key: 'purchase_date', align: 'center' },
  { title: 'Location', key: 'location', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center' },
]

// ==================
// Reactive Variables
// ==================
const equipments = ref([])
const isDeleteDialogOpen = ref(false)
const equipmentToDelete = ref(null)

// ==================
// Functions
// ==================

// Fetch drivers from Supabase
const fetchEquipments = async () => {
  isLoading.value = true
  const { data, error } = await supabase.from('equipments').select('*')
  if (error) {
    console.error('Error fetching equipment:', error.message)
  } else {
    equipments.value = data
  }
  isLoading.value = false
}

// Refresh Data
const refreshData = () => {
  fetchEquipments()
}

// Open Delete Dialog
const askDeleteEquipment = (equipments) => {
  equipmentToDelete.value = equipments
  isDeleteDialogOpen.value = true
}

// Confirm Delete
const confirmDeleteEquipment = async () => {
  if (!equipmentToDelete.value) return

  const { error } = await supabase.from('equipments').delete().eq('id', equipmentToDelete.value.id)
  if (error) {
    console.error('Error deleting equipment:', error.message)
  } else {
    refreshData()
  }

  isDeleteDialogOpen.value = false
  equipmentToDelete.value = null
}

// Edit Driver
const editEquipment = (id) => {
  router.push(`/equipment/edit/${id}`)
}

// View Details
// const viewDetails = (driver) => {
//   console.log('View details:', driver)
// }

// On mount
onMounted(() => {
  fetchEquipments()
})

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Equipments', disabled: true, href: '/equipment' }, // Current Page
])
</script>

<template>
  <DashboardLayout>
    <v-container class="px-2">
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
      </div>

      <!-- Driver Data Table -->
      <v-card :loading="isLoading" flat elevation="2">
        <v-data-table
          :headers="tableTitles"
          :items="equipments"
          item-value="id"
          class="rounded-lg"
          height="600"
          fixed-header
        >
          <!-- Row Number Column -->
          <template v-slot:item.row_number="{ index }">
            {{ index + 1 }}
          </template>

          <!-- Title Column -->
          <template v-slot:headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" class="text-center font-weight-bold">
                {{ column.title }}
              </th>
            </tr>
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
              <v-btn icon size="small" color="blue" @click="editEquipment(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="red" @click="askDeleteEquipment(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <!-- <v-btn icon size="small" color="green" @click="viewDetails(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn> -->
            </div>
          </template>

          <!-- Top Toolbar -->
          <template v-slot:top>
            <v-toolbar
              flat
              class="bg-gradient-to-r from-blue-500 to-teal-400 py-2 shadow-md d-flex justify-center align-center"
            >
              <!-- Add Equipment Button on the left -->
              <RouterLink to="/equipment/add" style="text-decoration: none">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  elevation="2"
                  variant="elevated"
                  class="ml-4 text-uppercase font-weight-bold"
                >
                  Add Equipment
                </v-btn>
              </RouterLink>

              <!-- Title in the Center -->
              <v-toolbar-title class="text-center font-weight-bold text-black">
                Equipment Information
              </v-toolbar-title>

              <!-- Refresh Button on the Right -->
              <v-btn
                icon
                @click="refreshData"
                class="mr-6"
                elevation="3"
                style="background-color: #4caf50; color: white; border-radius: 50%"
              >
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
            <strong>{{ equipmentToDelete?.type }} - {{ equipmentToDelete?.model }}</strong>
            >?
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey" @click="isDeleteDialogOpen = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDeleteEquipment">Yes, Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
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
