<template>
  <Pie :data="data" :options="options" />
</template>

<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

const props = defineProps({
  chartData: {
    type: Array<number>,
    default: [],
  },
  chartLbl: {
    type: Array<string>,
    default: [],
  },
});

ChartJS.register(ArcElement, Tooltip, Legend);

const data = computed(() => ({
  labels: props.chartLbl,
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: props.chartData,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
