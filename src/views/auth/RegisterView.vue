<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import {
  requiredValidator,
  emailValidator,
  confirmedValidator,
  passwordValidator,
} from '@/utils/validators'

import { supabase, formActionDefault } from '@/utils/supabase'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { useRouter } from 'vue-router'

const formAction = ref({
  ...formActionDefault,
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const refVform = ref()

const formDataDefault = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

// Trigger validators
const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid: isValid }) => {
    if (isValid) onSubmit()
  })
}

// Register Functionality
const onSubmit = async () => {
  // Reset Form action utils
  formAction.value = { ...formActionDefault }
  // Turn on processing
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        username: formData.value.username,
        // Just turn to true if admin account
        isAdmin: true,
        // role: 'Admin'
      },
    },
  })

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Registered Account.'
    router.replace('/dashboard')
  }
  // Reset Form
  refVform.value?.reset()
  formAction.value.formProcess = false
}

// Load pre-defined vue functions
const router = useRouter()
</script>

<template>
  <AuthLayout>
    <v-card class="register-card elevation-10 py-4 px-3">
      <div class="d-lg-none d-flex justify-center mb-4">
        <v-img src="/images/logo.png" width="200" height="200" />
      </div>
      <v-card-title class="text-lg-h4 text-sm-h4 text-center font-weight-bold register-title">
        CGB - Motorpol System
      </v-card-title>

      <v-card-subtitle class="text-center mb-3 text-h7">
        Please enter your credentials to Register.
      </v-card-subtitle>

      <v-card-text>
        <v-divider class="mb-3" />

        <!-- Alert message -->
        <AlertNotification
          :form-success-message="formAction.formSuccessMessage"
          :form-error-message="formAction.formErrorMessage"
        ></AlertNotification>

        <!-- Firstname -->
        <v-form class="mt-2" ref="refVform" @submit.prevent="onFormSubmit">
          <v-text-field
            label="Firstname"
            prepend-inner-icon="mdi-account-plus"
            type="text"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[requiredValidator]"
            v-model="formData.firstname"
          />

          <!-- Lastname -->
          <v-text-field
            label="Lastname"
            prepend-inner-icon="mdi-account-plus"
            type="text"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[requiredValidator]"
            v-model="formData.lastname"
          />

          <!-- Username -->
          <v-text-field
            label="Username"
            prepend-inner-icon="mdi-account-circle"
            type="text"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[requiredValidator]"
            v-model="formData.username"
          />

          <!-- Email -->
          <v-text-field
            label="Email"
            prepend-inner-icon="mdi-email"
            type="email"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[requiredValidator, emailValidator]"
            v-model="formData.email"
          />

          <!-- Password -->
          <v-text-field
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[requiredValidator, passwordValidator]"
            v-model="formData.password"
          />

          <!-- Password Confirmation -->
          <v-text-field
            label="Password Confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            density="comfortable"
            class="mb-4"
            outlined
            :rules="[
              requiredValidator,
              confirmedValidator(formData.password_confirmation, formData.password),
            ]"
            v-model="formData.password_confirmation"
          />

          <!-- Register Button -->
          <v-btn
            to=""
            type="submit"
            color="primary"
            block
            class="register-btn"
            size="large"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
          >
            <v-icon start class="me-2">mdi-account-plus</v-icon>
            Register
          </v-btn>
        </v-form>

        <v-divider class="my-3"></v-divider>

        <!-- Already have an Account -->
        <p class="text-center mt-4">
          Already have an Account?
          <RouterLink to="/login" class="text-decoration-none register-link-text">
            Click to Login
          </RouterLink>
        </p>
      </v-card-text>
    </v-card>
  </AuthLayout>
</template>

<style scoped>
.register-card {
  max-width: 600px;
  width: 100%;
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
}
.register-title {
  color: #053b79;
  font-family: 'Poppins', sans-serif;
}
.register-btn {
  border-radius: 25px;
  background-color: #053b79;
  color: white;
}
.register-btn:hover {
  background-color: #053b79;
}
.register-link-text {
  color: #053b79;
  font-weight: bold;
}
</style>
