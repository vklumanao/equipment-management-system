<script setup>
// ================================
// Imports
// ================================
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'

// ================================
// Router Instance
// ================================
const router = useRouter()
const route = useRoute()

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
// Fetch Existing Driver Data (for Edit)
// ================================
const fetchEquipments = async () => {
  const id = route.params.id

  const { data, error } = await supabase.from('equipments').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching equipment:', error.message)
    return
  }

  if (data) {
    equipment.value = {
      type: data.type,
      model: data.model,
      serial_number: data.serial_number,
      purchase_date: data.purchase_date,
      location: data.location,
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
  const { data: equipmentData, error: fetchError } = await supabase
    .from('equipments')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Error fetching equipment before update:', fetchError.message)
    formAction.value.formErrorMessage = fetchError.message
    formAction.value.formStatus = fetchError.status
    formAction.value.formProcess = false
    return
  }

  if (!equipmentData) {
    console.log('Equipment not found with ID:', id)
    formAction.value.formErrorMessage = 'Equipment not found'
    formAction.value.formProcess = false
    return
  }

  console.log('Equipment found:', equipmentData)

  // Proceed with update if equipment exists
  const { data, error } = await supabase
    .from('equipments')
    .update({
      type: equipment.value.type,
      model: equipment.value.model,
      serial_number: equipment.value.serial_number,
      purchase_date: equipment.value.purchase_date,
      location: equipment.value.location,
      status: equipment.value.status,
    })
    .eq('id', id)

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    // console.log('Data received:', data)
    formAction.value.formSuccessMessage = 'Successfully updated equipment.'
    console.log(formAction.value.formSuccessMessage)

    router.replace('/equipment') // Navigate back to driver list
  }

  formAction.value.formProcess = false
}

// ================================
// Lifecycle Hook
// ================================
// Fetch driver data when component is mounted
onMounted(() => {
  fetchEquipments()
})

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'Equipments', disabled: false, href: '/equipment' },
  { title: 'Edit Equipment', disabled: true }, // Current Page
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
          <h2 class="font-weight-bold mb-1">Edit Equipment</h2>
          <p class="text-grey-darken-2">
            Update the necessary fields to modify the equipment details.
          </p>
        </div>

        <!-- Form Body -->
        <v-card-text class="px-8 py-6">
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
                  density="comfortable"
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
                  density="comfortable"
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
                  required
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
                :loading="formAction.formProcess"
                :disabled="formAction.formProcess"
                color="primary"
                class="px-6 text-capitalize"
                size="large"
                type="submit"
              >
                Save Equipment
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
