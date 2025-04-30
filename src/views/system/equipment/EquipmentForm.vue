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
// Equipment Form Data
// ================================
const equipment = ref({
  type: '',
  model: '',
  serial_number: '',
  purchase_date: '',
  location: '',
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
  const { data, error } = await supabase.from('equipments').insert([equipment.value])

  if (error) {
    // Handle error
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    // Handle success
    formAction.value.formSuccessMessage = 'Successfully added equipment.'
    router.push('/equipment') // Navigate back to driver list
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
  { title: 'Equipments', disabled: false, href: '/equipment' },
  { title: 'Add Equipment', disabled: true }, // Current Page
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
          <h2 class="font-weight-bold mb-1">Add New Equipment</h2>
          <p class="text-grey-darken-2">Fill in the required fields to register new equipment.</p>
        </div>

        <!-- Form Body -->
        <v-card-text class="px-8 py-6">
          <v-form ref="refVform" @submit.prevent="onFormSubmit" lazy-validation>
            <v-row dense>
              <!-- Equipment Type -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="equipment.type"
                  :items="['Forklift', 'Crane', 'Truck', 'Excavator']"
                  label="Type"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Model -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.model"
                  label="Model"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Serial Number -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.serial_number"
                  label="Serial Number"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Purchase Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.purchase_date"
                  label="Purchase Date"
                  type="date"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Location -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.location"
                  label="Location"
                  :rules="[requiredValidator]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="equipment.status"
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
                type="submit"
                color="primary"
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess"
                class="px-6 text-capitalize"
                size="large"
              >
                Save Equipment
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
