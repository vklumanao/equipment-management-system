<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 fill-height">
        <v-row class="ma-0 bg-blue-lighten-5 justify-center align-center fill-height">
          <!-- Left column: Logo centered -->
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-img
              :src="'/images/logo.png'"
              :max-width="mobile ? '200' : '700'"
              :max-height="mobile ? '200' : '800'"
              class="logo-image"
            ></v-img>
          </v-col>

          <!-- Right column: Register form centered -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center bg-blue-lighten-5 form-column"
          >
            <v-card class="register-card elevation-10 py-4 px-3">
              <v-card-title class="text-h4 text-center font-weight-bold register-title">
                CGB - Motorpol System
              </v-card-title>

              <v-card-subtitle class="text-center mb-3">
                Please enter your credentials to Register.
              </v-card-subtitle>

              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Firstname"
                    prepend-inner-icon="mdi-account-plus"
                    type="text"
                    density="comfortable"
                    class="mb-4"
                    outlined
                  />

                  <v-text-field
                    label="Lastname"
                    prepend-inner-icon="mdi-account-plus"
                    type="text"
                    density="comfortable"
                    class="mb-4"
                    outlined
                  />

                  <v-text-field
                    label="Username"
                    prepend-inner-icon="mdi-account-circle"
                    type="text"
                    density="comfortable"
                    class="mb-4"
                    outlined
                  />

                  <v-text-field
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    type="email"
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

                  <v-text-field
                    label="Password Confirmation"
                    type="password"
                    prepend-inner-icon="mdi-lock-check"
                    density="comfortable"
                    class="mb-4"
                    outlined
                  />

                  <v-btn type="submit" color="primary" block class="register-btn" size="large">
                    <v-icon start class="me-2">mdi-account-plus</v-icon>
                    Register
                  </v-btn>
                </v-form>

                <v-divider class="my-3"></v-divider>

                <p class="text-center mt-4 register-link">
                  Already have an Account?
                  <RouterLink to="/" class="text-decoration-none register-link-text">
                    Click to Login
                  </RouterLink>
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="#053b79" class="text-white d-flex justify-center align-center footer">
      <span class="text-center w-100">
        &copy; {{ new Date().getFullYear() }} CGB - Motorpol System. All rights reserved.
      </span>
    </v-footer>
  </v-app>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
}

.v-container {
  max-width: 100%;
}

.v-row {
  max-width: 100%;
}

.logo-image {
  max-width: 100%;
  height: auto;
}

.form-column {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
}

.register-card {
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.register-title {
  color: #053b79;
  font-family: 'Poppins', sans-serif;
}

.register-btn {
  border-radius: 25px;
  background-color: #053b79;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.register-btn:hover {
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
  font-family: 'Poppins', sans-serif;
  border-radius: 10px;
}

p {
  font-size: 14px;
  color: #7a7a7a;
  font-family: 'Poppins', sans-serif;
}

.footer {
  height: 60px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}
</style>
