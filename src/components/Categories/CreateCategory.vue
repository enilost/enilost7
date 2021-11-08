<template >
  <div>
    <div class="page-subtitle">
      <h4>{{ $t("Create") }}</h4>
    </div>

    <form @submit.prevent="CreateCategory">
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model="CategoryName"
          :class="{ invalid: this.$v.CategoryName.$error }"
        />
        <label for="name">{{ $t("Category name") }}</label>
        <span class="helper-text invalid" v-if="this.$v.CategoryName.$error">{{
          $t("Enter a name")
        }}</span>
      </div>

      <div class="input-field">
        <input
          id="limit"
          type="number"
          v-model.trim.number="CategoryLimit"
          :class="{ invalid: this.$v.CategoryLimit.$error }"
        />
        <label for="limit">{{ $t("Limit") }}</label>
        <span class="helper-text invalid" v-if="this.$v.CategoryLimit.$error"
          >{{
            $t("Minimum limit", {
              min: '"' + this.$v.CategoryLimit.$params.minValue.min + '"',
            })
          }}
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $t("Create") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>
<script>
import { required, minValue } from "vuelidate/lib/validators";
import M from "materialize-css/dist/js/materialize.min.js";
// eslint-disable-next-line no-unused-vars
import { mapActions } from "vuex";

export default {
  name: "CreateCategory",
  components: {},
  data() {
    return {
      CategoryName: "",
      CategoryLimit: 100,
    };
  },
  methods: {
    ...mapActions(["CREATE_CATEGORY_ACTION"]),
    //
    //*клик создание категории
    //
    async CreateCategory() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.CREATE_CATEGORY_ACTION({
          name: this.CategoryName,
          limit: this.CategoryLimit,
        });
        M.toast({
          html: `
          ${this.$t("Create category", {
            newCtgr: '"' + this.CategoryName + '"',
          })}
          `,
        });

        this.CategoryLimit = this.$v.CategoryLimit.$params.minValue.min;
        this.CategoryName = "";
        this.$v.$reset();
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {},
  watch: {},
  validations: {
    CategoryName: { required },
    CategoryLimit: { required, minValue: minValue(100) },
  },
  mounted() {
    //
    //*правит лейблы в нормалайз ЦСС
    //
    M.updateTextFields();
  },
};
</script>
<style lang="">
</style>