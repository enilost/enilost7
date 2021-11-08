<template>
  <div>
    <div class="page-title">
      <h3>{{ $t("Bill") }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="reloadBtn">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <div class="row">
      <div class="col s12 m6 l4">
        <div class="card light-blue bill-card">
          <div class="card-content white-text">
            <span class="card-title">
              {{ $t("Currency account") }}
            </span>
            <PreLoader
              v-if="Object.keys(this.USER_INFO_GET).length == false"
            ></PreLoader>

            <div v-else-if="Object.keys(this.USER_INFO_GET).length">
              <p class="currency-line">
                <span>{{ USER_INFO_GET.bill }} &#8381;</span>
              </p>
              <p class="currency-line" v-if="currency">
                <span>{{ currency }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="col s12 m6 l8">
        <div class="card orange darken-3 bill-card">
          <div class="card-content white-text">
            <div class="card-header">
              <span class="card-title">
                {{ $t("Exchange rate") }}
              </span>
            </div>

            <div class="row search">
              <div class="col s12">
                {{ $t("Search") }}
                <div class="input-field inline">
                  <input
                    id="input_text"
                    type="text"
                    class="validate qwe"
                    v-model.trim="search"
                  />
                  <label for="input_text">
                    {{ $t("Enter currency name") }}
                  </label>
                </div>
              </div>
            </div>

            <PreLoader
              v-if="Object.keys(this.RATE_GET).length == false"
            ></PreLoader>
            <table v-else>
              <thead>
                <tr>
                  <th>{{ $t("Currency") }}</th>
                  <th>{{ $t("Rate") }}</th>
                  <th>{{ $t("Date") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(valute, index) in searchValute"
                  :key="index"
                  @click="convertation(valute.Value, valute.CharCode)"
                  class="pointer hoverable"
                >
                  <td>{{ valute.CharCode }}</td>
                  <td>{{ valute.Value.toFixed(2) }} &#8381;</td>
                  <td>{{ RATE_GET.Date.substr(0, 10) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import PreLoader from "@/components/Preloader.vue";
import M from "materialize-css/dist/js/materialize.min.js";

export default {
  name: "Home",
  components: {
    PreLoader,
  },
  metaInfo: {
    title: "SPA-Home",
  },
  data() {
    return {
      isPreLoaderRate: true,
      isPreLoaderStatement: true,
      currency: false,
      search: "",
    };
  },
  methods: {
    ...mapActions(["RATE_ACTION", "USER_INFO_ACTION"]),
    ...mapMutations(["RATE_CLEAR", "CLEAR_USER_INFO"]),
    //
    //*клик по кнопке перезагрузки чистит данные во vuex и заново их запрашивает
    //
    async reloadBtn() {
      this.currency = false;
      this.search = "";
      await this.RATE_CLEAR();
      await this.CLEAR_USER_INFO();
      await this.USER_INFO_ACTION();
      await this.RATE_ACTION();
      M.updateTextFields();
    },
    //
    //*клик по выбранной из списка валюте конвертирует в нее счет и выводит результат (this.currency)
    //
    convertation(course, code) {
      this.currency =
        (this.USER_INFO_GET.bill / course).toFixed(2) + ` ${code}`;
    },
  },
  computed: {
    ...mapGetters(["RATE_GET", "USER_INFO_GET"]),
    //
    //*поиск валюты
    //
    searchValute() {
      const SearchResult = [];
      let keys;
      if (Object.keys(this.RATE_GET).length) {
        keys = Object.keys(this.RATE_GET.Valute).filter((valute) => {
          return (
            valute
              .toString()
              .toUpperCase()
              .indexOf(this.search.toUpperCase()) >= 0
          );
        });
        keys.forEach((e) => {
          SearchResult.push(this.RATE_GET.Valute[e]);
        });
        return SearchResult;
      }
      return this.RATE_GET.Valute;
    },
  },
  watch: {},
  async mounted() {
    await this.RATE_ACTION();
    await this.USER_INFO_ACTION();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
#input_text {
  color: white;
  margin-bottom: 0;
  border-bottom: 2px solid white;
  box-shadow: 0 1px 0 0 white;
}
.input-field {
  margin-top: 0px;
  margin-bottom: 0;
  @media (max-width: 957px) {
    margin-top: 10px;
  }
}
.input-field label {
  color: rgba(255, 255, 255, 0.575);
}
.search {
  margin-bottom: 0;
  .s12 {
    margin-top: 0px;
  }
}

.input-field .active {
  color: #055479 !important;
}
.col .orange {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
