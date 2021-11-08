<template>
  <div id="app">
    <component :is="this.layout" :key="this.$i18n.locale">
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
import LogRegLayout from "@/components/layout/LogRegLayout.vue";
import MainLayout from "@/components/layout/MainLayout.vue";

export default {
  //* ключ :key="this.$i18n.locale" в component - это перерендер при смене языка

  name: "app",
  components: {
    LogRegLayout,
    MainLayout,
  },
  data() {
    return {
      currency: null,
    };
  },
  methods: {},
  computed: {
    layout() {
      return this.$route.meta.layout || LogRegLayout;
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";
</style>

