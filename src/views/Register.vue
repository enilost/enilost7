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
          class="validate"
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
      <div class="input-field">
        <input
          id="name"
          type="text"
          class="validate"
          v-model.trim="name"
          :class="{
            invalid: this.$v.name.$error,
          }"
        />
        <label for="name">Имя</label>
        <small
          class="helper-text invalid"
          v-if="
            (this.$v.name.$dirty && !this.$v.name.minLength) ||
            (this.$v.name.$dirty && !this.$v.name.required)
          "
          >Длинна поля должна быть больше
          {{ this.$v.name.$params.minLength.min }} символов
        </small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="isChecked" />
          <span>С правилами согласен</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link :to="{ name: 'Login' }">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";
import messages from "@/plugins/messages.js";
/*global M*/

export default {
  name: "Register",
  components: {},
  data() {
    return {
      isChecked: false,
      password: "",
      email: "",
      name: "",
    };
  },
  methods: {
    ...mapActions(["REGISTRATION_ACTION"]),
    async submitForm() {
      if (this.$v.$invalid || !this.isChecked) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name,
      };
      try {
        await this.REGISTRATION_ACTION(formData);
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
    name: { required, minLength: minLength(3) },
  },
};
</script>
<style lang="scss" >
</style>