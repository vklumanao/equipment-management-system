<script setup>
// ==================
// Imports
// ==================
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'

// ==================
// Router Instance
// ==================
const router = useRouter()

// ==================
// Table Headers
// ==================
const tableTitles = [
  { title: 'No.', key: 'row_number', align: 'center' },
  { title: 'Request Type', key: 'type', align: 'center' },
  { title: 'Requested By', key: 'requested_by', align: 'center' },
  { title: 'Date Requested', key: 'date_requested', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center' },
]

// ==================
// Reactive Variables
// ==================
const requests = ref([])
const isDeleteDialogOpen = ref(false)
const requestToDelete = ref(null)

// ==================
// Fetch Requests
// ==================
const fetchRequests = async () => {
  const { data, error } = await supabase
    .from('equipment_requests')
    .select(`*
    `)

  if (error) {
    console.error('Error fetching requests:', error.message)
  } else {
    const parsed = data.map((req) => {
      const latestApproval = req.request_approvals?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      return {
        id: req.id,
        type: req.equipment_id,
        requested_by: req.fullname  || 'Unknown',
        date_requested: req.created_at,
        status: latestApproval?.status || 'Pending',
      }
    })

    requests.value = parsed
  }
}

// ==================
// Functions
// ==================
const refreshData = () => {
  fetchRequests()
}

const askDeleteRequest = (request) => {
  requestToDelete.value = request
  isDeleteDialogOpen.value = true
}

const confirmDeleteRequest = async () => {
  if (!requestToDelete.value) return

  const { error } = await supabase
    .from('equipment_requests')
    .delete()
    .eq('id', requestToDelete.value.id)

  if (error) {
    console.error('Error deleting request:', error.message)
  } else {
    refreshData()
  }

  isDeleteDialogOpen.value = false
  requestToDelete.value = null
}

const editRequest = (id) => {
  router.push(`/request/edit/${id}`)
}

onMounted(() => {
  fetchRequests()
})

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Requests', disabled: true, href: '/request' },
])
</script>

<template>
  <DashboardLayout>
    <div class="px-2">
      <!-- Breadcrumbs -->
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

      <!-- Request Data Table -->
      <v-card flat elevation="2">
        <v-data-table
          :headers="tableTitles"
          :items="requests"
          item-value="id"
          class="rounded-lg"
          height="600"
          fixed-header
        >
          <!-- Row Number -->
          <template v-slot:item.row_number="{ index }">
            {{ index + 1 }}
          </template>

          <!-- Header -->
          <template v-slot:headers="{ columns }">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="text-center font-weight-bold"
              >
                {{ column.title }}
              </th>
            </tr>
          </template>

          <!-- Status -->
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'error' : 'warning'"
              text-color="white"
              size="small"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <!-- Actions -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center align-center" style="gap: 8px">
              <v-btn icon size="small" color="blue" @click="editRequest(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="red" @click="askDeleteRequest(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <!-- Top Toolbar -->
          <template v-slot:top>
            <v-toolbar
              flat
              class="bg-gradient-to-r from-green-500 to-blue-400 py-2 shadow-md d-flex justify-center align-center"
            >
              <RouterLink to="/request/add" style="text-decoration: none">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus-box"
                  elevation="2"
                  class="ml-4 text-uppercase font-weight-bold"
                >
                  Add Request
                </v-btn>
              </RouterLink>

              <v-toolbar-title class="text-center font-weight-bold text-black">
                Equipment Requests
              </v-toolbar-title>

              <v-btn icon @click="refreshData" class="mr-4">
                <v-icon color="black">mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card>

      <!-- Delete Confirmation -->
      <v-dialog v-model="isDeleteDialogOpen" max-width="400px">
        <v-card class="pa-4">
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon color="error" class="mr-2">mdi-alert</v-icon>
            Confirm Deletion
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete this request?
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text color="grey" @click="isDeleteDialogOpen = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDeleteRequest">Yes, Delete</v-btn>
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
