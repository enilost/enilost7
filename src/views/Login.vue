<template>
  <form class="card auth-card" @submit.prevent="submitForm">
    <div class="card-content">
      <span class="card-title">Домашняя бухгалтерия</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          :class="{
            invalid: this.$v.email.$error,
          }"
        />
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="this.$v.email.$dirty && !this.$v.email.required"
        >
          Заполните поле Email
        </small>
        <small
          class="helper-text invalid"
          v-else-if="this.$v.email.$dirty && !this.$v.email.email"
        >
          Введите корректный Email
        </small>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="password"
          :class="{
            invalid: this.$v.password.$error,
          }"
        />
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="this.$v.password.$dirty && !this.$v.password.required"
          >Заполните поле Password</small
        >
        <small
          class="helper-text invalid"
          v-else-if="this.$v.password.$dirty && !this.$v.password.minLength"
          >Длинна пароля должна быть больше
          {{ this.$v.password.$params.minLength.min }} символов
        </small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Нет аккаунта?
        <router-link :to="{ name: 'Register' }">Зарегистрироваться</router-link>
      </p>
    </div>
  </form>
</template>
<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import M from "materialize-css/dist/js/materialize.min.js";
// eslint-disable-next-line no-unused-vars
import { mapActions, mapGetters } from "vuex";

import messages from "@/plugins/messages.js";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      password: "",
      email: "",
    };
  },
  methods: {
    ...mapActions(["LOGIN_ACTION"]),
    async submitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.LOGIN_ACTION(formData);
        this.$router.push("/");
        this.$store.commit("CLEAR_ERROR");
      } catch (error) {
        M.toast({
          html: messages[this.ERROR_GET.code] || "Произошла неизвестная ошибка",
        });
      }
    },
  },
  computed: {
    ...mapGetters(["ERROR_GET"]),
  },
  validations: {
    password: { required, minLength: minLength(7) },
    email: { email, required },
  },
};
</script>
<style lang="scss" >
</style>