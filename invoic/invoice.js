<template>
  <div>
    <h1>Invoice Dashboard</h1>
    <canvas id="invoiceChart"></canvas>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale);

export default {
  name: 'InvoiceDashboard',
  components: {
    Line
  },
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Invoice Amount',
            data: [3000, 2000, 4500, 5000, 3500, 6000],
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
          }
        ]
      }
    };
  },
  mounted() {
    this.renderChart(this.chartData, { responsive: true, maintainAspectRatio: false });
  }
};
</script>

<style scoped>
#invoiceChart {
  max-width: 600px;
  margin: auto;
}
</style>