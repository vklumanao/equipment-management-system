<script setup>
import { ref } from 'vue'
const rememberMe = ref(false)
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

          <!-- Right column: Login form centered -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center bg-blue-lighten-5 form-column"
          >
            <v-card class="login-card elevation-10 py-5 px-2">
              <!-- Profile icon on top center -->
              <div class="d-flex justify-center mb-4">
                <v-avatar size="100" color="primary">
                  <v-icon size="90" color="white">mdi-account-circle</v-icon>
                </v-avatar>
              </div>
              <v-card-title class="text-h4 text-center font-weight-bold login-title">
                CGB - Motorpol System
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

                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember Me"
                    class="mb-4"
                    color="primary"
                  />

                  <v-btn type="submit" color="primary" block class="login-btn" size="large">
                    <v-icon start class="me-2">mdi-login</v-icon>
                    Login
                  </v-btn>
                </v-form>
                <p class="text-center mt-4 register-link">
                  Don't have an account?
                  <RouterLink to="" class="text-decoration-none register-link-text">
                    Register here
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
      <span class="text-center w-100" style="font-family: Poppins">
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
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

.v-container {
  max-width: 100%; /* Prevent the container from overflowing */
}

.v-row {
  max-width: 100%;
}

.logo-image {
  max-width: 100%; /* Prevent the image from overflowing */
  height: auto;
}

.form-column {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
}

.login-card {
  max-width: 700px;
  width: 100%;
  /* padding: 10px; */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.login-title {
  color: #053b79;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

.login-btn {
  border-radius: 25px;
  background-color: #053b79;
  color: white;
  font-family: 'Poppins', sans-serif;
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
}
</style>
