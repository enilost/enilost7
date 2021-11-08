<template>
  <div>
    <PreLoader v-if="!DETAIL_RECORD_GETT"></PreLoader>
    <div v-if="DETAIL_RECORD_GETT">
      <div class="breadcrumb-wrap">
        <router-link :to="{ name: `History` }">{{ $t("History") }}</router-link>
        <a class="breadcrumb"
          >{{
            DETAIL_RECORD_GETT.type === "outcome"
              ? `${$t("Outcome")}`
              : `${$t("Income")}`
          }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: DETAIL_RECORD_GETT.type === 'outcome',
              green: DETAIL_RECORD_GETT.type === 'income',
            }"
          >
            <div class="card-content white-text">
              <p>
                {{ $t("Description") }}: {{ DETAIL_RECORD_GETT.desciption }}
              </p>
              <p>{{ $t("Limit") }}: {{ DETAIL_RECORD_GETT.limit }}</p>
              <p>{{ $t("Category name") }}: {{ DETAIL_RECORD_GETT.name }}</p>
              <p>ID- {{ id }}</p>

              <small>{{
                new Date(DETAIL_RECORD_GETT.date).toLocaleString()
              }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters, mapActions } from "vuex";
import PreLoader from "@/components/Preloader.vue";

export default {
  name: "DetailRecord",
  components: {
    PreLoader,
  },
  metaInfo: {
    title: "SPA-Detail",
  },
  props: {},
  data() {
    return {
      id: null,
    };
  },
  methods: {
    ...mapActions(["DETAIL_RECORD_ACTION"]),
  },
  computed: {
    ...mapGetters(["DETAIL_RECORD_GETT"]),
  },
  watch: {},
  async mounted() {
    await this.DETAIL_RECORD_ACTION(this.$route.params.idx);
    this.id = await this.DETAIL_RECORD_GETT.key;
  },
  created() {},
};
</script>
<style lang="">
</style>