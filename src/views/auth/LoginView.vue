<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import { requiredValidator } from '@/utils/validators'

const rememberMe = ref(false)
const showPassword = ref(false)

const refVform = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid: isValid }) => {
    if (isValid) onSubmit()
  })
}
</script>

<template>
  <AuthLayout>
    <v-card class="login-card elevation-10 py-4 px-3">
      <div class="d-lg-none d-flex justify-center mb-4">
        <v-img src="/images/logo.png" width="200" height="200" />
      </div>
      <v-card-title class="text-lg-4 text-sm-h4 text-center font-weight-bold login-title">
        CGB - Motorpol System
      </v-card-title>

      <v-card-subtitle class="text-center mb-3 text-h7">
        Please enter your credentials to Login.
      </v-card-subtitle>

      <v-card-text>
        <v-divider class="mb-3" />
        <v-form ref="refVform" @submit.prevent="onFormSubmit">
          <v-text-field
            label="email"
            prepend-inner-icon="mdi-account-circle"
            outlined
            class="mb-4"
            :rules="[requiredValidator]"
            v-model="formData.email"
          />

          <v-text-field
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            outlined
            class="mb-4"
            :rules="[requiredValidator]"
          />
          <v-checkbox v-model="rememberMe" label="Remember Me" class="my-1" color="primary" />
          <v-btn type="submit" color="primary" block class="login-btn" size="large">
            <v-icon start class="me-2">mdi-login</v-icon>
            Login
          </v-btn>
        </v-form>

        <v-divider class="my-3" />

        <p class="text-center mt-4">
          Don't have an account?
          <RouterLink to="/register" class="text-decoration-none register-link-text">
            Click to Register
          </RouterLink>
        </p>
      </v-card-text>
    </v-card>
  </AuthLayout>
</template>

<style scoped>
.login-card {
  max-width: 600px;
  width: 100%;
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
}
.login-title {
  color: #053b79;
  font-family: 'Poppins', sans-serif;
}
.login-btn {
  background-color: #053b79;
  color: white;
  border-radius: 25px;
}
.register-link-text {
  color: #053b79;
  font-weight: bold;
}
</style>
