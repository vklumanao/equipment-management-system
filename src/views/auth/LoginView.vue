<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const valid = ref(false)

const rules = {
  required: (v) => !!v || 'Required field',
  email: (v) => /.+@.+\..+/.test(v) || 'Enter a valid email',
}

function login() {
  console.log('Logging in with:', {
    email: email.value,
    password: password.value,
    remember: rememberMe.value,
  })
}
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-8" max-width="600" width="100%" elevation="10" rounded="xl">
      <v-card-title class="text-h4 text-center">Login Form</v-card-title>

      <v-card-text class="pa-8" max-width="600" width="100%" elevation="10" rounded="xl">
        <v-form v-model="valid" @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email"
            :rules="[rules.required, rules.email]"
            required
            density="comfortable"
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required]"
            required
            density="comfortable"
          />

          <v-checkbox v-model="rememberMe" label="Remember Me" />

          <v-btn type="submit" color="primary" :disabled="!valid" block class="mt-4" size="large">
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card-title {
  justify-content: center;
}
</style>
