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
    <v-container class="px-2">
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
          <h2 class="font-weight-bold mb-1">Add New Driver</h2>
          <p class="text-grey-darken-2">Fill in the required fields to register a new driver.</p>
        </div>

        <!-- Form Body -->
        <v-card-text class="px-8 py-6">
          <v-form ref="refVform" @submit.prevent="onFormSubmit" lazy-validation>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.full_name"
                  label="Full Name"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.license_number"
                  label="License Number"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.license_expiry"
                  label="License Expiry Date"
                  type="date"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="driver.experience_year"
                  label="Years of Experience"
                  type="number"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="driver.status"
                  :items="['Active', 'Inactive']"
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
                Save Driver
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
