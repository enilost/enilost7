<template>
  <div>
    <div class="page-title">
      <h3>{{ $t("New entry") }}</h3>
    </div>
    <preloader v-show="isPreloader"></preloader>
    <form class="form" @submit.prevent="newRecord" v-show="!isPreloader">
      <div class="input-field">
        <select id="slct2" v-model="sel" @change="selectClick">
          <option value="" disabled selected v-if="CATEGORIES_GETT.length">
            {{ $t("Select a category") }}
          </option>
          <option value="" disabled selected v-else>
            {{ $t("No categories") }}
          </option>
          <option v-for="c in CATEGORIES_GETT" :key="c.id" :value="c">
            {{ c.name }}
          </option>
        </select>
        <label>{{ $t("Select a category") }}</label>
      </div>

      <transition name="rdo">
        <div v-show="isShowHideRadio" class="rdo">
          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="income"
                v-model="radioBtn"
              />
              <span>{{ $t("Income") }}</span>
            </label>
          </p>
          <span class="helper-text invalid" v-if="this.$v.radioBtn.$error">{{
            $t("Select a category")
          }}</span>
          <p>
            <label>
              <input
                class="with-gap"
                name="type"
                type="radio"
                value="outcome"
                v-model="radioBtn"
              />
              <span>{{ $t("Outcome") }}</span>
            </label>
          </p>
        </div>
      </transition>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model="limit"
          onkeydown="return event.keyCode !== 69"
          :disabled="!CATEGORIES_GETT.length || !this.sel.id"
        />
        <label for="amount">{{ $t("Limit") }}</label>
        <span class="helper-text invalid" v-if="this.$v.limit.$error"
          >{{
            $t("Minimum limit", {
              min: '"' + this.$v.limit.$params.minValue.min + '"',
            })
          }}
        </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="desciption"
          :disabled="!CATEGORIES_GETT.length || !this.sel.id"
        />
        <label for="description">{{ $t("Description") }}</label>
        <span class="helper-text invalid" v-if="this.$v.desciption.$error">{{
          $t("Description")
        }}</span>
      </div>

      <button
        class="btn waves-effect waves-light"
        type="submit"
        :disabled="!CATEGORIES_GETT.length"
      >
        {{ $t("Create") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import M from "materialize-css/dist/js/materialize.min.js";
// eslint-disable-next-line no-unused-vars
import { required, minValue, numeric } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";

import Preloader from "../components/Preloader.vue";

export default {
  name: "Record",
  components: { Preloader },
  metaInfo: {
    title: "SPA-Record",
  },
  data() {
    return {
      MSelect: false,
      isPreloader: true,
      isShowHideRadio: false,
      sel: {},
      radioBtn: "",
      limit: "",
      desciption: "",
      name: "",
      destrSelect: false,
    };
  },
  methods: {
    ...mapActions([
      "CATEGORIES_ACTION",
      "RECORD_INCOME_ACTION",
      "USER_INFO_ACTION",
    ]),
    //
    //*клик по селекту показывает радиоБТН, заполняет переменную
    //
    selectClick() {
      this.isShowHideRadio = true;
      this.name = this.sel.name;
    },
    //
    //*клик по созданию записи
    //
    async newRecord() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      if (
        //*проверяет баланс
        +this.USER_INFO_GET.bill < +this.limit &&
        this.radioBtn === "outcome"
      ) {
        M.toast({
          html: `${this.$t("Insufficient funds", {
            count:
              '"' +
              (+this.limit - +this.USER_INFO_GET.bill).toLocaleString("ru-Ru") +
              '"' +
              ".00" +
              "&#8381;",
          })}`,
        });
        return;
      }
      let newBill; //*пересчет баланса
      if (this.radioBtn === "income") {
        newBill = +this.USER_INFO_GET.bill + +this.limit;
      } else {
        newBill = +this.USER_INFO_GET.bill - +this.limit;
      }
      try {
        await this.RECORD_INCOME_ACTION({
          desciption: this.desciption,
          bill: newBill,
          id: this.sel.id,
          limit: this.limit,
          date: new Date().toJSON(),
          type: this.radioBtn,
          name: this.name,
        });
        M.toast({
          html: `${this.$t("Record added")}`,
        });
        this.limit = "";
        this.desciption = "";
        this.$v.$reset();
        return;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters(["CATEGORIES_GETT", "USER_INFO_GET"]),
  },
  watch: {
    //
    //*при напонении убирает загрузку и пересоздает материалайз селект
    //
    CATEGORIES_GETT() {
      this.isPreloader = false;
      this.$nextTick(() => {
        if (this.MSelect) {
          this.MSelect.destroy();
          this.MSelect = M.FormSelect.init(document.getElementById("slct"));
        }
      });
    },
    destrSelect() {
      //
      //*все время ловил ошибку в этом компоненте при уничтожении селекта в хуке beforeDestroy, попробовал сделать переменную, которая меняет свое значение в хуке и привязать к ней дестрой(ошибка пропала, правда хз, работают ли еще ватчеры в beforeDestroy;=) )
      //
      this.MSelect.destroy();
    },
  },
  validations: {
    radioBtn: { required },
    limit: { required, numeric, minValue: minValue(100) },
    desciption: { required },
  },
  async mounted() {
    await this.USER_INFO_ACTION();
    await this.CATEGORIES_ACTION();
    const slct = document.querySelector("#slct2");
    this.MSelect = M.FormSelect.init(slct);
  },
  beforeDestroy() {
    // if (this.MSelect && this.MSelect.destroy) {
    //   this.MSelect.destroy();
    // }
    this.destrSelect = true;
  },
};
</script>
<style lang="css" >
/* простая аним для появленя радио баттена */
.rdo {
  overflow: hidden;
}
.rdo-enter-active {
  animation: rdo 0.3s linear;
}
.rdo-leave-active {
  animation: rdo 0.3s linear reverse;
}

@keyframes rdo {
  0% {
    height: 0px;
  }
  50% {
    height: 32px;
  }
  100% {
    height: 92px;
  }
}
</style>