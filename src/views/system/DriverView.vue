<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/components/system/DashboardLayout.vue'
import { computed } from 'vue'

  const headers = [
    { title: 'First Name', align: 'start', key: 'name' },
    { title: 'Last Name', align: 'end', key: 'last_name' },
    { title: 'Contact Number', align: 'end', key: 'contact_no' },
    { title: 'License Number', align: 'end', key: 'license_no' },
    { title: 'License Expiry', align: 'end', key: 'expiry' },
    { title: 'Experience(Years)', align: 'end', key: 'year_exp' },
    { title: 'Status', align: 'end', key: 'status' },
  ]

  const boats = [
    {
      name: 'Chino',
      last_name: 'Panya',
      contact_no: 63956728282,
      license_no: 2222,
      expiry: 2025,
      year_exp: 2,
      status: 'Inheat'
    },
    {
      name: 'Pablo',
      last_name: 'Job',
      contact_no: 63956728282,
      license_no: 2212,
      expiry: 2026,
      year_exp: 2,
      status: 'Available'   
    },
    {
      name: 'Voyager',
      speed: 20,
      length: 45,
      price: 700000,
      year: 2019,
    },
    {
      name: 'WaveRunner',
      speed: 40,
      length: 19,
      price: 250000,
      year: 2022,
    },
    {
      name: 'SeaBreeze',
      speed: 28,
      length: 31,
      price: 450000,
      year: 2018,
    },
    {
      name: 'HarborGuard',
      speed: 18,
      length: 50,
      price: 800000,
      year: 2017,
    },
    {
      name: 'SlickFin',
      speed: 33,
      length: 24,
      price: 350000,
      year: 2021,
    },
    {
      name: 'StormBreaker',
      speed: 22,
      length: 38,
      price: 600000,
      year: 2020,
    },
    {
      name: 'WindSail',
      speed: 15,
      length: 55,
      price: 900000,
      year: 2019,
    },
    {
      name: 'FastTide',
      speed: 37,
      length: 20,
      price: 280000,
      year: 2022,
    },
  ]

  const virtualBoats = computed(() => {
    return [...Array(30).keys()].map(i => {
      const boat = { ...boats[i % 10] }
      boat.name = `${boat.name} #${i}`
      return boat
    })
  })

  function formatPrice (value) {
    return `$${value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')}`
  }

</script>

<template>
    <DashboardLayout>
      <div class="pa-2">
        <div class="mb-4 d-flex justify-start">
          <v-btn
            prepend-icon="mdi-check-circle"
            append-icon="mdi-account-circle"
          >
            <template v-slot:prepend>
              <v-icon color="success"></v-icon>
            </template>
  
            Add Driver
  
            <template v-slot:append>
              <v-icon color="warning"></v-icon>
            </template>
          </v-btn>
        </div>
  
        <v-data-table-virtual
          :headers="headers"
          :items="virtualBoats"
          height="550"
          item-value="name"
          fixed-header
        ></v-data-table-virtual>
      </div>
    </DashboardLayout>
  </template>
    

<style scoped>

</style>
    