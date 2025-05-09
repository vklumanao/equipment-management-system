<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  active: Number,
  inactive: Number,
})

const chartData = {
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      label: 'Equipment Availability',
      data: [props.active, props.inactive],
      backgroundColor: ['#4caf50', '#f44336'], // green, red
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Equipment Availability',
    },
  },
}
</script>

<template>
  <v-card
    class="pa-6 rounded-2xl"
    elevation="4"
    style="
      border-radius: 20px;
      background-color: #f9fafb;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
    "
  >
    <h3 class="font-weight-bold mb-4">Equipment Availability</h3>
    <Pie :data="chartData" :options="chartOptions" />
  </v-card>
</template>
