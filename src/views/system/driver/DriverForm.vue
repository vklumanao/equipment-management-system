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
  } else {
    // Handle success
    formAction.value.formSuccessMessage = 'Successfully added driver.'
    router.push('/driver') // Navigate back to driver list
  }

  // Reset form
  refVform.value?.reset()
  formAction.value.formProcess = false
}

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Drivers', disabled: false, href: '/driver' },
  { title: 'Add Driver', disabled: true }, // Current Page
])
</script>

<template>
  <DashboardLayout>
    <v-container class="pa-4" fluid>
      <!-- ================================
           Breadcrumbs
           ================================ -->
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

      <!-- ================================
           Add New Driver Form Card
           ================================ -->
      <v-card elevation="2" class="pa-8 rounded-2xl">
        <v-card-title class="text-2xl font-bold mb-4">Add New Driver</v-card-title>

        <v-card-text>
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
                />
              </v-col>
            </v-row>

            <!-- Submit Button -->
            <div class="d-flex justify-end mt-6">
              <v-btn
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess"
                color="primary"
                class="text-capitalize"
                size="large"
                type="submit"
              >
                Save Driver
              </v-btn>
            </div>

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
