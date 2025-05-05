<script setup>
// ================================
// Imports
// ================================
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'

// ================================
// Router and Route Instances
// ================================
const router = useRouter()
const route = useRoute()

// ================================
// Driver Form Data
// ================================
const driver = ref({
  full_name: '',
  license_number: '',
  license_expiry: '',
  experience_year: '',
  status: '',
})

// ================================
// Form Action State
// ================================
const formAction = ref({
  ...formActionDefault,
})

// Form reference
const refVform = ref()

// ================================
// Fetch Existing Driver Data (for Edit)
// ================================
const fetchDriver = async () => {
  const id = route.params.id

  const { data, error } = await supabase.from('drivers').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching driver:', error.message)
    return
  }

  if (data) {
    driver.value = {
      full_name: data.full_name,
      license_number: data.license_number,
      license_expiry: data.license_expiry,
      experience_year: data.experience_year,
      status: data.status,
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
// Actual Submit Logic (UPDATE)
// ================================
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const id = route.params.id

  // Check if the driver exists before attempting the update
  const { data: driverData, error: fetchError } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching driver before update:', fetchError.message)
    formAction.value.formErrorMessage = fetchError.message
    formAction.value.formStatus = fetchError.status
    formAction.value.formProcess = false
    return
  }

  if (!driverData) {
    console.log('Driver not found with ID:', id)
    formAction.value.formErrorMessage = 'Driver not found'
    formAction.value.formProcess = false
    return
  }

  console.log('Driver found:', driverData)

  // Proceed with update if driver exists
  const { data, error } = await supabase
    .from('drivers')
    .update({
      full_name: driver.value.full_name,
      license_number: driver.value.license_number,
      license_expiry: driver.value.license_expiry,
      experience_year: driver.value.experience_year,
      status: driver.value.status,
    })
    .eq('id', id)

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    // console.log('Data received:', data)
    formAction.value.formSuccessMessage = 'Successfully updated driver.'
    console.log(formAction.value.formSuccessMessage)

    router.replace('/driver') // Navigate back to driver list
  }

  formAction.value.formProcess = false
}

// ================================
// Lifecycle Hook
// ================================
// Fetch driver data when component is mounted
onMounted(() => {
  fetchDriver()
})

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Drivers', disabled: false, href: '/driver' },
  { title: 'Edit Driver Information', disabled: true }, // Current Page
])
</script>

<template>
  <DashboardLayout>
    <v-container fluid class="px-2">
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
          <h2 class="font-weight-bold mb-1">Edit Driver Information</h2>
          <p class="text-grey-darken-2">
            Update the necessary fields to modify the driver's information.
          </p>
        </div>

        <!-- Form Body -->
        <v-card-text class="px-8 py-6">
          <v-form lazy-validation ref="refVform" @submit.prevent="onFormSubmit">
            <v-row dense>
              <!-- Full Name Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.full_name"
                  label="Full Name"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- License Number Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.license_number"
                  label="License Number"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- License Expiry Date Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.license_expiry"
                  label="License Expiry Date"
                  type="date"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Years of Experience Field -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.experience_year"
                  label="Years of Experience"
                  type="number"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Status Dropdown -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="driver.status"
                  :items="['Active', 'Inactive']"
                  label="Status"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <!-- Submit Button -->
            <div class="d-flex justify-end mt-6">
              <v-btn
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess"
                color="primary"
                class="px-6 text-capitalize"
                size="large"
                type="submit"
              >
                Update Driver
              </v-btn>
            </div>

            <!-- Alert Notification -->
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
