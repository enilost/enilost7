<template>
  <div>
    <div class="page-title">
      <h3>{{ $t("Categories") }} 123</h3>
    </div>
    <section>
      <div class="row">
        <div class="col s12 m6">
          <PreLoader v-if="loading"></PreLoader>
          <CreateCategory v-else> </CreateCategory>
        </div>
        <div class="col s12 m6">
          <PreLoader v-if="loading"></PreLoader>
          <EditCategory v-else></EditCategory>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CreateCategory from "@/components/Categories/CreateCategory.vue";
import EditCategory from "@/components/Categories/EditCategory.vue";
import PreLoader from "@/components/Preloader.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Categories",
  components: {
    CreateCategory,
    EditCategory,
    PreLoader,
  },
  metaInfo: {
    title: "SPA-Categories",
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    ...mapActions(["CATEGORIES_ACTION"]),
  },
  computed: {
    ...mapGetters(["CATEGORIES_GETT"]),
  },
  watch: {},
  async mounted() {
    await this.CATEGORIES_ACTION();

    this.loading = false;
  },
};
</script>
<style lang="">
</style>