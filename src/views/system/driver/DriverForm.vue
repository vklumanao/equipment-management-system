<script setup>
// ================================
// Imports
// ================================
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'

// ================================
// Router Instance
// ================================
const router = useRouter()

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
  // Reset form action to default
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  // Insert driver record into Supabase
  const { data, error } = await supabase.from('drivers').insert([driver.value])

  if (error) {
    // Handle error
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Handle success
    formAction.value.formSuccessMessage = 'Successfully added driver.'
    router.push('/driver') // Navigate back to driver list
  }

  // Reset form
  refVform.value?.reset()
  formAction.value.formProcess = false
}
</script>

<template>
  <DashboardLayout>
    <v-container class="pa-4" fluid>
      <!-- ================================
           Add New Driver Form Card
           ================================ -->
      <v-card elevation="2" class="pa-4 rounded-2xl">
        <v-card-title class="text-xl font-bold">Add New Driver</v-card-title>

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
              Save Driver
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
