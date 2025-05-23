<script setup>
// ================================
// Imports
// ================================
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'

// ================================
// Router Instance
// ================================
const router = useRouter()
const route = useRoute()
// ================================
// Request Form Data
// ================================
const request = ref({
  request_type: '',
  description: '',
  request_date: '',
  status: '',
  requested_by: '',
})

// ================================
// Form Action State
// ================================
const formAction = ref({
  ...formActionDefault,
})

// Form reference
const refVform = ref()

const fetchRequest = async () => {
  const id = route.params.id

  const { data, error } = await supabase.from('request').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching request:', error.message)
    return
  }

  if (data) {
    request.value = {
      request_type: data.request_type,
      description: data.description,
      request_date: data.request_date,
      status: data.status,
      requested_by: data.requested_by,
    }
  }
}

// ================================
// Form Submit Handler
// ================================
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid: isValid }) => {
    if (isValid) onSubmit()
  })
}

// ================================
// Actual Submit Logic
// ================================
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true


  // Check if the request exists before attempting the update
  const { data, error } = await supabase.from('requests').insert([request.value]) 
    
  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    formAction.value.formSuccessMessage = 'Successfully added equipment.'
    router.push('/request')
  }

  refVform.value?.reset()
   formAction.value.formProcess = false
    }
// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Requests', disabled: false, href: '/request' },
  { title: 'Add Request', disabled: true },
])
</script>

<template>
  <DashboardLayout>
    <v-container fluid class="pa-6">
      <!-- Breadcrumbs -->
      <v-breadcrumbs :items="breadcrumbs" class="mb-4">
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

      <!-- Form Card -->
      <v-card class="rounded-xl elevation-2">
        <!-- Header -->
        <div class="py-6 px-8 bg-grey-lighten-5 border-b">
          <h2 class="font-weight-bold mb-1">Add New Request</h2>
          <p class="text-grey-darken-2">Fill in the required fields to register a new request.</p>
        </div>

        <!-- Form Body -->
        <v-card-text class="px-8 py-6">
          <v-form ref="refVform" @submit.prevent="onFormSubmit" lazy-validation>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="request.request_type"
                  label="Request Type"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="request.description"
                  label="Description"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="request.request_date"
                  label="Request Date"
                  type="date"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="request.requested_by"
                  label="Requested By"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="request.status"
                  :items="['Pending', 'Approved', 'Rejected']"
                  label="Status"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <!-- Submit Button -->
            <div class="d-flex justify-end mt-6">
              <v-btn
                type="submit"
                color="primary"
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess"
                class="px-6 text-capitalize"
                size="large"
              >
                Save Request
              </v-btn>
            </div>

            <!-- Notifications -->
            <AlertNotification
              class="mt-6"
              :form-success-message="formAction.formSuccessMessage"
              :form-error-message="formAction.formErrorMessage"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>