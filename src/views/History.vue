<template>
  <div class="">
    <div class="page-title">
      <h3>{{ $t("History") }}</h3>
    </div>

    <PreLoader v-if="loading"></PreLoader>

    <p v-if="!RECORDS_GETT.length">{{ $t("No records") }}</p>

    <historyChart v-if="RECORDS_GETT.length" class="h"></historyChart>

    <section v-if="RECORDS_GETT.length">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th @click="sortLimit" class="pointer">
              {{ $t("Limit") }} <i class="material-icons">unfold_more</i>
            </th>
            <th @click="sortDate" class="pointer">
              {{ $t("Date") }} <i class="material-icons">unfold_more</i>
            </th>
            <th>{{ $t("Categories") }}</th>
            <th>{{ $t("Type") }}</th>
            <th>{{ $t("Open") }}</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(r, i) in paginationContent"
            :key="i"
            class="hoverable"
            @click="modalDeteil(r)"
          >
            <td>{{ i + 1 }}</td>
            <td>{{ r.limit }}</td>
            <td>{{ date(r.date) }}</td>
            <td>{{ r.name }}</td>
            <td>
              <span
                class="white-text badge red"
                v-show="r.type === 'outcome'"
                >{{ $t("Outcome") }}</span
              >
              <span
                class="white-text badge green"
                v-show="r.type === 'income'"
                >{{ $t("Income") }}</span
              >
            </td>
            <td>
              <button
                class="btn-small btn"
                v-ToolTip="`${$t('Details')}`"
                @click.stop="detail(r)"
              >
                <i class="material-icons">open_in_new</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <Paginate
      v-model="activePage"
      :page-count="Math.ceil(this.RECORDS_GETT.length / this.itemInPage)"
      :click-handler="clickPagination"
      :prev-text="'chevron_left'"
      :prev-link-class="'material-icons'"
      :next-text="'chevron_right'"
      :next-link-class="'material-icons'"
      :container-class="'pagination'"
      :page-class="'waves-effect'"
      :margin-pages="1"
      :page-range="5"
      v-if="RECORDS_GETT.length"
    >
    </Paginate>

    <div id="modal1" class="modal">
      <div class="modal-content">
        <h5>{{ modalTitle }}</h5>
        <h6>{{ modalText }}</h6>
      </div>
      <div class="modal-footer">
        <a
          href="#!"
          class="modal-close waves-effect waves-green btn-flat"
          @click="
            modal.open();
            modal.close();
          "
          >Agree</a
        >
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import PreLoader from "../components/Preloader.vue";
import M from "materialize-css/dist/js/materialize.min.js";
import historyChart from "@/components/History/historyChart.vue";

export default {
  name: "History",
  components: {
    PreLoader,
    historyChart,
  },
  metaInfo: {
    title: "SPA-History",
  },
  data() {
    return {
      rec: [],
      loading: true,
      isMinMax: true,
      isDate: true,
      modal: false,
      modalText: "",
      modalTitle: "",
      activePage: +this.$route.query.page || 1,
      itemInPage: 5,
    };
  },
  methods: {
    ...mapActions(["ALL_RECORDS_ACTION", "CATEGORIES_ACTION"]),
    //
    //*сортировка по лимиту
    //
    sortLimit() {
      if (this.isMinMax) {
        this.rec.sort((a, b) => {
          return +a.limit - +b.limit;
        });
        this.isMinMax = false;
        return;
      }
      if (!this.isMinMax) {
        this.rec.sort((a, b) => {
          return +b.limit - +a.limit;
        });
        this.isMinMax = true;
        return;
      }
    },
    //
    //*сортировка по дате
    //
    sortDate() {
      if (this.isDate) {
        this.rec.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        this.isDate = false;
        return;
      }
      if (!this.isDate) {
        this.rec.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        this.isDate = true;
        return;
      }
    },
    //
    //*вывод даты
    //
    date(e) {
      let opt = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(e).toLocaleString([this.$i18n.locale], opt);
    },
    //
    //*модалка
    //
    modalDeteil(r) {
      this.modalText = r.desciption;
      this.modalTitle = r.name;
      this.modal.open();
    },
    //
    //*переход в детали, добавляет путь в роутер
    //
    detail(r) {
      this.$router.push({
        name: "DetailRecord",
        params: {
          idx: r.key,
        },
      });
    },
    //
    //*пагинация, добавляет номер страницы в путь роутера
    //
    clickPagination(p) {
      this.$router.push({
        name: "History",
        query: {
          page: `${+p}`,
        },
      });
    },
  },
  computed: {
    ...mapGetters(["RECORDS_GETT"]),
    //
    //*пагинация динамически вырезает слайсом контент для страницы из геттера
    //
    paginationContent() {
      let contentPage = this.RECORDS_GETT.slice(
        (this.activePage - 1) * this.itemInPage,
        this.activePage * this.itemInPage
      );
      return contentPage;
    },
  },
  watch: {
    RECORDS_GETT() {
      this.loading = false;
    },
  },
  async mounted() {
    await this.CATEGORIES_ACTION();
    await this.ALL_RECORDS_ACTION();
    this.rec = this.RECORDS_GETT;
    this.modal = await M.Modal.init(document.getElementById("modal1"));
    this.loading = false;
  },
  destroyed() {
    if (this.modal) {
      this.modal.destroy();
    }
  },
};
</script>
<style lang="css">
.h {
  overflow: hidden;
}
</style>