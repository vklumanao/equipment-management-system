<script setup>
import { ref } from 'vue'
const rememberMe = ref(false)
</script>

<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height ma-0">
      <!-- Left column: Logo centered -->
      <v-col cols="12" md="7" class="d-flex justify-center align-center logo-column">
        <v-img src="/images/logo.png" max-width="700" max-height="700"></v-img>
      </v-col>

      <!-- Right column: Login form centered -->
      <v-col cols="12" md="5" class="d-flex flex-column justify-center align-center form-column">
        <v-card class="login-card">
          <v-card-title class="text-h4 text-center font-weight-bold login-title">
            CGB - Motorpol System
          </v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                prepend-inner-icon="mdi-email"
                density="comfortable"
                class="mb-4"
                outlined
              />

              <v-text-field
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock"
                density="comfortable"
                class="mb-4"
                outlined
              />

              <v-checkbox v-model="rememberMe" label="Remember Me" class="mb-4" color="primary" />

              <v-btn type="submit" color="primary" block class="login-btn" size="large">
                Login
              </v-btn>
            </v-form>
            <p class="text-center mt-4 register-link">
              Don't have an account?
              <RouterLink to="" class="text-decoration-none register-link-text"
                >Register</RouterLink
              >
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.logo-column {
  padding: 20px;
}

.form-column {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
}

.login-card {
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.login-title {
  color: #4a90e2;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
}

.login-btn {
  border-radius: 25px;
  background-color: #4a90e2;
  color: white;
}

.login-btn:hover {
  background-color: #357abd;
}

.register-link-text {
  color: #4a90e2;
  font-weight: 500;
}

.register-link-text:hover {
  text-decoration: underline;
}

.v-text-field,
.v-checkbox {
  border-radius: 10px;
}

p {
  font-size: 14px;
  color: #7a7a7a;
}
</style>
