<script setup>
// ================================
// Imports
// ================================
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
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

  // Update driver record instead of insert
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
    // Handle error
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Handle success
    formAction.value.formSuccessMessage = 'Successfully updated driver.'
    router.push('/driver') // Navigate back to driver list
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
</script>

<template>
  <DashboardLayout>
    <v-container class="pa-4" fluid>
      <!-- ================================
           Edit Driver Form Card
           ================================ -->
      <v-card elevation="2" class="pa-4 rounded-2xl">
        <v-card-title class="text-xl font-bold">Edit Driver</v-card-title>

        <v-card-text>
          <v-form lazy-validation ref="refVform" @submit.prevent="onFormSubmit">
            <!-- Full Name Field -->
            <v-text-field
              v-model="driver.full_name"
              label="Full Name"
              :rules="[requiredValidator]"
              required
            />

            <!-- License Number Field -->
            <v-text-field
              v-model="driver.license_number"
              label="License Number"
              :rules="[requiredValidator]"
              required
            />

            <!-- License Expiry Date Field -->
            <v-text-field
              v-model="driver.license_expiry"
              label="License Expiry Date"
              type="date"
              :rules="[requiredValidator]"
            />

            <!-- Years of Experience Field -->
            <v-text-field
              v-model="driver.experience_year"
              label="Years of Experience"
              type="number"
              :rules="[requiredValidator]"
            />

            <!-- Status Dropdown -->
            <v-select
              v-model="driver.status"
              :items="['Active', 'Inactive']"
              label="Status"
              :rules="[requiredValidator]"
            />

            <!-- Submit Button -->
            <v-btn
              :loading="formAction.formProcess"
              :disabled="formAction.formProcess"
              color="primary"
              class="mt-4"
              type="submit"
            >
              Update Driver
            </v-btn>

            <!-- Alert Notification (Success/Error) -->
            <AlertNotification
              :form-success-message="formAction.formSuccessMessage"
              :form-error-message="formAction.formErrorMessage"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>
