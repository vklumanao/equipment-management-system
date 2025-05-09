<template>
  <div>
    <v-card class="pa-6 rounded-2xl" elevation="4">
      <v-row>
        <v-col cols="12">
          <h3 class="font-weight-bold">Driver Availability</h3>
          <BarChart :chartData="chartData" :chartOptions="chartOptions" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { defineProps, watch, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Register the necessary chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Define props for active and inactive drivers
const props = defineProps({
  active: {
    type: Number,
    required: true,
  },
  inactive: {
    type: Number,
    required: true,
  },
})

// Create reactive data for chart
const chartData = ref({
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      label: 'Drivers',
      data: [props.active, props.inactive],
      backgroundColor: ['#4caf50', '#f44336'],
      borderRadius: 8,
      barThickness: 25,
    },
  ],
})

// Create reactive chart options
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      max: Math.max(props.active, props.inactive) + 5,
    },
    y: {
      beginAtZero: true,
    },
  },
})

// Watch for prop changes and update the chart data
watch([() => props.active, () => props.inactive], () => {
  chartData.value.datasets[0].data = [props.active, props.inactive]
  chartOptions.value.scales.x.max = Math.max(props.active, props.inactive) + 5
})
</script>
