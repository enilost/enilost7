<template>
  <div>
    <div class="page-title" @click="locale">
      <h3>{{ $t("Profile") }}</h3>
    </div>
    <PreLoader v-if="loading"></PreLoader>
    <form class="form" @submit.prevent="update" v-else>
      <div class="input-field">
        <input id="description" type="text" v-model="name" />
        <label for="description">{{ $t("Name") }}</label>
        <i18n
          path="MinLength"
          class="helper-text invalid"
          tag="span"
          v-if="this.$v.name.$error"
        >
          <template v-slot:break>
            {{ $v.name.$params.minLength.min }}
          </template>
        </i18n>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ $t("Update") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
    <br />
    <form action="#">
      <p v-for="(l, i) in localization" :key="i">
        <label>
          <input
            name="group1"
            type="radio"
            :value="l"
            @click="locale(l)"
            v-model="$i18n.locale"
          />

          <span>{{ l }}</span>
        </label>
      </p>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PreLoader from "@/components/Preloader.vue";
import M from "materialize-css/dist/js/materialize.min.js";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "Profile",
  components: {
    PreLoader,
  },
  metaInfo: {
    title: "SPA-Profile",
  },
  data() {
    return {
      name: "",
      loading: true,
      localization: ["en", "ru"],
    };
  },
  methods: {
    ...mapActions(["USER_INFO_ACTION", "UPDATE_USER_INFO_ACTION"]),
    //
    //*смена локализации
    //
    locale(l) {
      this.$i18n.locale = l;
    },
    //
    //*подставление имени в инпут
    //
    async named() {
      this.name = await this.USER_INFO_GET.name;
    },
    //
    //*редактирование имени
    //
    async update() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.UPDATE_USER_INFO_ACTION(this.name);
        M.toast({
          html: `
             ${this.$t("Rename profile", { name: '"' + this.name + '"' })}
          `,
        });
        this.$v.$reset();
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters(["USER_INFO_GET"]),
  },
  watch: {},
  validations: {
    name: { required, minLength: minLength(3) },
  },
  async mounted() {
    await this.USER_INFO_ACTION();
    this.loading = false;
    await this.named();
    M.updateTextFields();
  },
};
</script>
<style lang="">
</style>