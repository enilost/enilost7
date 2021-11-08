<template>
  <div>
    <div class="page-title">
      <h3>{{ $t("Planning") }}</h3>
      <h4>{{ USER_INFO_GET.bill }} &#x20bd;</h4>
    </div>

    <Preloader v-if="loading"></Preloader>
    <p v-else-if="!CATEGORIES_GETT.length">
      {{ $t("No categories") }} :
      <router-link :to="{ name: 'Categories' }">{{
        $t("Categories")
      }}</router-link>
    </p>
    <section v-else>
      <div v-for="c in CATEGORIES_GETT" :key="c.id">
        <p>
          <strong>{{ c.name }}:</strong>
          {{ outcome[c.id] || 0 }} из {{ c.limit }}
        </p>

        <div class="progress" v-ToolTip="tooltip(c)">
          <div
            class="determinate"
            :class="{
              red: width(c) >= 77, //outcome[c.id] || 0) / c.limit) * 100
              orange: width(c) > 50 && parseInt(width(c)) < 77,
              green: width(c) <= 50,
            }"
            :style="{ width: width(c) + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapGetters, mapActions } from "vuex";
import Preloader from "../components/Preloader.vue";

export default {
  name: "Planing",
  components: {
    Preloader,
  },
  metaInfo: {
    title: "SPA-Planing",
  },
  data() {
    return {
      loading: true,
      // C: "",
    };
  },
  methods: {
    ...mapActions(["ALL_RECORDS_ACTION", "CATEGORIES_ACTION"]),
    //
    //*рассчитывает ширину заполнения баров
    //*и привязывается к классу для цвета
    //
    width(c) {
      if (((this.outcome[c.id] || 0) / +c.limit) * 100 > 100) {
        return 100;
      }
      return ((this.outcome[c.id] || 0) / +c.limit) * 100;
    },
    tooltip(c) {
      if (+this.outcome[c.id] > +c.limit) {
        return `${this.$t("Exceeded by", {
          sum: (+this.outcome[c.id] - +c.limit).toLocaleString("ru-RU"),
        })},00 &#x20bd;`;
      }
      return `${this.$t("Remaining", {
        sum: (c.limit - (+this.outcome[c.id] || 0)).toLocaleString("ru-RU"),
      })},00 &#x20bd;`;
    },
  },
  computed: {
    ...mapGetters(["USER_INFO_GET", "CATEGORIES_GETT", "RECORDS_GETT"]),
    //
    //*считает расходы
    //
    outcome() {
      //*фильтрует все записи, отбирая только outcome
      let outcome = this.RECORDS_GETT.filter((e) => {
        return e ? e.type == "outcome" : [];
      });
      const out = {};
      //*цикл, по отфильтрованному массиву, который наполняет объект
      //*ключ id
      //*а значение ключа складывается из (старого значения || 0)  + лимит
      //*то есть если такого ключа нет, то он его создает со значением 0
      //*и плюсует лимит
      //*а если ключ уже есть, то плюсует лимит к его значению
      //* rhfcbdsq wbrk? vyt ghjcn gjyhfdbkcz)
      for (let i = 0; i < outcome.length; i++) {
        const e = outcome[i];
        out[e.id] = (+out[e.id] || 0) + +e.limit;
      }
      return out;
    },
  },
  watch: {
    //*загрузка
    RECORDS_GETT() {
      this.loading = false;
    },
  },
  async mounted() {
    await this.CATEGORIES_ACTION();
    await this.ALL_RECORDS_ACTION();
  },
};
</script>
<style lang="">
</style>