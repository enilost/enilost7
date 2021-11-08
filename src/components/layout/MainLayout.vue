<template>
  <div class="app-main-layout">
    <TopMenu @isLeftMenuSelect="isLeftMenuSelect"></TopMenu>

    <LeftMenu :class="{ open: isLeftMenu }"></LeftMenu>

    <main class="app-content" :class="{ full: !isLeftMenu }">
      <div class="app-page">
        <router-view></router-view>
      </div>
    </main>

    <div class="fixed-action-btn" v-ToolTip="`${$t('New entry')}`">
      <router-link
        class="btn-floating btn-large blue"
        href="#"
        :to="{ name: 'Record' }"
      >
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>
<script>
import LeftMenu from "@/components/layout/MainLayout/LeftMenu.vue";
import TopMenu from "@/components/layout/MainLayout/TopMenu.vue";

export default {
  name: "MainLayout",
  components: {
    LeftMenu,
    TopMenu,
  },
  data() {
    return {
      isLeftMenu: true,
    };
  },
  methods: {
    isLeftMenuSelect() {
      this.isLeftMenu = !this.isLeftMenu;
    },
  },
  computed: {},
};
</script>

<style lang="css">
</style>
