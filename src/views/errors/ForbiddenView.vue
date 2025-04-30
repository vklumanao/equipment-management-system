<script setup></script>

<template>
  <v-container
    fluid
    class="d-grid"
    style="place-items: center; height: 100vh; background-color: #ffffff"
  >
    <v-card
      class="pa-10 rounded-xl text-center"
      elevation="8"
      style="
        max-width: 480px;
        background-color: #ffffff;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      "
    >
      <v-icon size="80" color="red-darken-2" class="mb-6" style="animation: pop 0.4s ease-out">
        mdi-alert-octagon
      </v-icon>

      <h2 class="font-weight-bold text-red-darken-2 mb-3">403 - Forbidden</h2>
      <p class="text-grey-darken-1 mb-6">
        You don't have the required permissions to access this page.<br />
        Please contact your administrator for access.
      </p>

      <RouterLink to="/" style="text-decoration: none">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-arrow-left"
          class="text-capitalize px-6 py-3 font-weight-medium"
        >
          Back to Home
        </v-btn>
      </RouterLink>
    </v-card>
  </v-container>
</template>

<style scoped>
@keyframes pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
