<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

const rememberMe = ref(false)
</script>

<template>
  <AuthLayout>
    <v-card class="login-card elevation-10 py-4 px-3">
      <v-card-title class="text-lg-h4 text-sm-h4 text-center font-weight-bold login-title">
        CGB - Motorpol System
      </v-card-title>

      <v-card-subtitle class="text-center mb-3">
        Please enter your credentials to Login.
      </v-card-subtitle>

      <v-card-text>
        <v-form>
          <v-text-field
            label="Username"
            prepend-inner-icon="mdi-account-circle"
            outlined
            class="mb-4"
          />
          <v-text-field
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock"
            outlined
            class="mb-4"
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
