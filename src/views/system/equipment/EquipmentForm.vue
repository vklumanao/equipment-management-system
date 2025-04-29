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
           Add New Equipment Form Card
           ================================ -->
      <v-card elevation="2" class="pa-8 rounded-2xl">
        <v-card-title class="text-2xl font-bold mb-4">Add New Equipment</v-card-title>

        <v-card-text>
          <v-form lazy-validation ref="refVform" @submit.prevent="onFormSubmit">
            <v-row dense>
              <!-- Equipment Type -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="equipment.type"
                  :items="['Forklift', 'Crane', 'Truck', 'Excavator']"
                  label="Type"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
                />
              </v-col>

              <!-- Model -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.model"
                  label="Model"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
                />
              </v-col>

              <!-- Serial Number -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.serial_number"
                  label="Serial Number"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
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
                />
              </v-col>

              <!-- Location -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment.location"
                  label="Location"
                  :rules="[requiredValidator]"
                  required
                  variant="outlined"
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
                Save Equipment
              </v-btn>
            </div>

            <!-- Alert Notification -->
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
