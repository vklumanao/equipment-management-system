<script setup>
// ================================
// Imports
// ================================
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault, getUserInformation } from '@/utils/supabase'
import { requiredValidator } from '@/utils/validators'

// ================================
// Router Instance
// ================================
const router = useRouter()

// ================================
// Request Form Data
// ================================
const equipment_requests = ref({
  user_id: '', // from auth
  equipment_id: '',
  created_at: '',
  description: '',
  requestor_id: '', // from auth
})

const userData = ref({
  id: '',
  email: '',
  fullname: '',
})

// Get Current User Information
const getUser = async () => {
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.firstname + ' ' + metadata.lastname
  userData.value.initials = getAvatarText(userData.value.fullname)
  userData.value.role = role

  equipment_requests.value.requestor_id = metadata.id
}

const equipmentList = ref([])

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
  // if (!equipment_requests.value.requestor_id) {
  //   // formAction.value.formErrorMessage = 'Requestor ID is required.'
  //   formAction.value.formProcess = false
  //   return
  // }

  formAction.value.formProcess = true
  const { data, error } = await supabase
    .from('equipment_requests')
    .insert([equipment_requests.value])

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else {
    formAction.value.formSuccessMessage = 'Request successfully added.'
    router.push('/request') // Redirect after success
  }

  formAction.value.formProcess = false
}

// Lifecycle hook: Fetch driver count when component is mounted
onMounted(() => {
  getUser()
  console.log('After getUser:', equipment_requests.value.requestor_id)
})

onMounted(async () => {
  const { data, error } = await supabase
    .from('equipments')
    .select('id, model, type, status, serial_number')

  if (error) {
    console.error('Error fetching equipment:', error.message)
    return
  }

  equipmentList.value = data.map((item) => ({
    ...item,
    display_name: `${item.type} - ${item.model} (${item.serial_number})`,
  }))
})

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

      <v-card class="rounded-xl elevation-2">
        <div class="py-6 px-8 bg-grey-lighten-5 border-b">
          <h2 class="font-weight-bold mb-1">Add New Request</h2>
          <p class="text-grey-darken-2">Fill in the form to submit a new equipment request.</p>
        </div>

        <v-card-text class="px-8 py-6">
          <v-form ref="refVform" @submit.prevent="onFormSubmit" lazy-validation>
            <v-row dense>
              <!-- <v-col cols="12" md="6">
                <v-text-field
                  v-model=""
                  label="Request Type"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col> -->

              <v-col cols="12" md="6">
                <v-select
                  v-model="equipment_requests.equipment_id"
                  :items="equipmentList"
                  item-title="display_name"
                  item-value="id"
                  label="Select Equipment"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="equipment_requests.created_at"
                  label="Request Date"
                  type="date"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="equipment_requests.description"
                  label="Description"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                  rows="4"
                />
              </v-col>

              <!-- <v-col cols="12" md="6">
                <v-select
                  v-model="equipment_requests.status"
                  :items="['Pending', 'Approved', 'Rejected']"
                  label="Status"
                  variant="outlined"
                  :rules="[requiredValidator]"
                  density="comfortable"
                />
              </v-col> -->

              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="equipment_requests.requestor_id"
                  label="Requested By (User ID)"
                  variant="outlined"
                  disabled
                />

                <v-text-field
                  :model-value="userData.fullname"
                  label="Requested By (Full Name)"
                  variant="outlined"
                  disabled
                />
              </v-col>
            </v-row>

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
