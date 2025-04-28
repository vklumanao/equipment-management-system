<script setup>
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { ref } from 'vue'
import { requiredValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AlertNotification from '@/components/common/AlertNotification.vue'

const router = useRouter()

const driver = ref({
  full_name: '',
  license_number: '',
  license_expiry: '',
  experience_year: '',
  status: '',
})

const formAction = ref({
  ...formActionDefault,
})

const refVform = ref()

// Submit Handler
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid: isValid }) => {
    if (isValid) onSubmit()
  })
}

// Actual Submit Logic
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.from('drivers').insert([driver.value])

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully added driver.'
    router.push('/driver') //
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}
</script>

<template>
  <DashboardLayout>
    <v-container class="pa-4" fluid>
      <v-card elevation="2" class="pa-4 rounded-2xl">
        <v-card-title class="text-xl font-bold">Add New Driver</v-card-title>

        <v-card-text>
          <v-form lazy-validation ref="refVform" @submit.prevent="onFormSubmit">
            <v-text-field
              v-model="driver.full_name"
              label="Full Name"
              :rules="[requiredValidator]"
              required
            />

            <v-text-field
              v-model="driver.license_number"
              label="License Number"
              :rules="[requiredValidator]"
              required
            />

            <v-text-field
              v-model="driver.license_expiry"
              label="License Expiry Date"
              type="date"
              :rules="[requiredValidator]"
            />

            <v-text-field
              v-model="driver.experience_year"
              label="Years of Experience"
              type="number"
              :rules="[requiredValidator]"
            />

            <v-select
              v-model="driver.status"
              :items="['Active', 'Inactive']"
              label="Status"
              :rules="[requiredValidator]"
            />

            <v-btn
              :loading="formAction.formProcess"
              :disabled="formAction.formProcess"
              color="primary"
              class="mt-4"
              type="submit"
            >
              Save Driver
            </v-btn>

            <!-- Alert message -->
            <AlertNotification
              :form-success-message="formAction.formSuccessMessage"
              :form-error-message="formAction.formErrorMessage"
            ></AlertNotification>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>
