<template>
  <div id="chart">
    <apexcharts
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
      v-if="this.RECORDS_GETT.length"
    ></apexcharts>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ApxChrt",
  components: {
    apexcharts: VueApexCharts,
  },
  props: {},
  data() {
    return {
      date: [],
      data: [],
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "category",
          categories: [],
          labels: {
            show: true,
            formatter: (val) => new Date(val).toLocaleString(),
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    };
  },
  methods: {
    ...mapActions(["ALL_RECORDS_ACTION"]),
    updateChart() {
      console.log("1");
    },
  },
  computed: {
    ...mapGetters(["RECORDS_GETT"]),
  },
  async mounted() {
    await this.ALL_RECORDS_ACTION();
    await this.RECORDS_GETT.forEach((e) => {
      this.date.push(e.date);
      this.data.push(e.bill);
    });

    this.series = await [
      ...this.series,
      ...[
        {
          name: "money",
          data: this.data.reverse(),
        },
      ],
    ];

    this.chartOptions = await {
      ...this.chartOptions,
      ...{
        xaxis: {
          categories: this.date.reverse(),
          labels: {
            show: true,
            formatter: (val) => new Date(val).toLocaleString().slice(0, 17),
          },
        },
      },
    };
  },
};
</script>
<style lang="scss">
</style>
