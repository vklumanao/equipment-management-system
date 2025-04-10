<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
import FooterLayout from '../common/FooterLayout.vue'
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

          <!-- Right column: slot content (login/register form) -->
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center bg-blue-lighten-5 form-column"
          >
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <FooterLayout />
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
  border-radius: 15px;
}
</style>
