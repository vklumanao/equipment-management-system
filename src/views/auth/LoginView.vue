<script setup>
import { ref } from 'vue'
const rememberMe = ref(false)
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height ma-0 bg-blue-lighten-5">
      <!-- Left column: Logo centered -->
      <v-col cols="12" md="7" class="d-flex justify-center align-center logo-column">
        <v-img src="/images/logo.png" max-width="850" max-height="850"></v-img>
      </v-col>

      <!-- Right column: Login form centered -->
      <v-col
        cols="12"
        md="5"
        class="d-flex flex-column justify-center align-center form-column bg-blue-lighten-5"
      >
        <v-card class="login-card">
          <v-card-title class="text-h4 text-center font-weight-bold login-title">
            <v-icon left>mdi-login</v-icon> CGB - Motorpol System
          </v-card-title>

          <v-card-subtitle class="text-center mb-3">
            Please enter your credentials to log in.
          </v-card-subtitle>

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
              <RouterLink to="" class="text-decoration-none register-link-text">
                Register
              </RouterLink>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
html {
  font-family: 'Poppins', sans-serif;
}

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
  max-width: 700px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.login-title {
  color: #053b79;
  font-family: 'Poppins', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
}

.login-btn {
  border-radius: 25px;
  background-color: #053b79;
  color: white;
  font-family: 'Poppins', Tahoma, Geneva, Verdana, sans-serif;
}

.login-btn:hover {
  background-color: #053b79;
}

.register-link-text {
  color: #053b79;
  font-weight: 500;
}

.register-link-text:hover {
  text-decoration: underline;
}

.v-text-field,
.v-checkbox {
  font-family: 'Poppins', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 10px;
}

p {
  font-size: 14px;
  color: #7a7a7a;
  font-family: 'Poppins', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
