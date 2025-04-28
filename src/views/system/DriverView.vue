<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'

const tableTitles = [
  { title: 'First Name', align: 'start', key: 'name' },
  { title: 'Last Name', align: 'start', key: 'last_name' },
  { title: 'Status', align: 'start', key: 'status' },
  { title: 'Action', align: 'start', key: 'action' },
  { title: 'Details', align: 'start', key: 'details' },
]

const driver = [
  // Add sample data for testing purposes
  { name: 'John', last_name: 'Doe', status: 'Active' },
  { name: 'Jane', last_name: 'Smith', status: 'Inactive' },
  { name: 'John', last_name: 'Doe', status: 'Active' },
  { name: 'Jane', last_name: 'Smith', status: 'Inactive' },
  { name: 'John', last_name: 'Doe', status: 'Active' },
  { name: 'Jane', last_name: 'Smith', status: 'Inactive' },
  { name: 'John', last_name: 'Doe', status: 'Active' },
  { name: 'Jane', last_name: 'Smith', status: 'Inactive' },
]

const refreshData = () => {
  // Handle refreshing data here
  console.log('Data refreshed')
}
</script>

<template>
  <DashboardLayout>
    <div class="pa-0">
      <!-- Button Section -->
      <div class="mb-6 d-flex justify-start align-center">
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
      </div>

      <!-- Data Table Section -->
      <div class="table-container">
        <v-data-table-virtual
          :headers="tableTitles"
          :items="driver"
          height="600 "
          item-value="name"
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
              <v-btn @click="deleteDriver(item.name)" color="red" icon size="x-small">
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
