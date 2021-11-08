<template>
  <div>
    <nav class="navbar orange lighten-1">
      <div class="nav-wrapper">
        <div class="navbar-left">
          <a href="#" @click.prevent="HideShowLeftMenu">
            <i class="material-icons black-text">dehaze</i>
          </a>
          <span class="black-text">{{ date }}</span>
        </div>

        <ul class="right hide-on-small-and-down">
          <li>
            <a
              class="dropdown-trigger black-text"
              href="#"
              data-target="dropdown"
              id="drop"
            >
              {{ USER_INFO_GET.name }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>

            <ul id="dropdown" class="dropdown-content">
              <li>
                <router-link :to="{ name: 'Profile' }" class="black-text">
                  <i class="material-icons">account_circle</i
                  >{{ $t("Profile") }}
                </router-link>
              </li>
              <li class="divider" tabindex="-1"></li>
              <li>
                <a href="#" class="black-text" @click.prevent="modal2.open()">
                  <i class="material-icons">assignment_return</i
                  >{{ $t("Exit") }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Modal Structure -->
    </nav>
    <div id="modal2" class="modal">
      <div class="modal-content">
        <h4>{{ $t("Are you sure exit") }}</h4>
      </div>
      <div class="modal-footer">
        <a class="waves-effect waves-light btn" @click.prevent="clickExit">{{
          $t("Exit")
        }}</a>
        <a
          href="#!"
          class="modal-close waves-effect waves-green btn-flat"
          @click.prevent="modal2.close()"
          >{{ $t("Cancel") }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import M from "materialize-css/dist/js/materialize.min.js";

import messages from "@/plugins/messages.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "TopMenu",
  data() {
    return {
      date: new Date().toLocaleString(),
      dateDestroy: null,
      dropdownDestroy: null,
      isMtoast: false,
      modal2: false,
    };
  },
  props: {},
  methods: {
    ...mapActions(["LOOUT_ACTION", "USER_INFO_ACTION"]),
    //
    //*открытие закрытие боковой навигации
    //
    HideShowLeftMenu() {
      this.$emit("isLeftMenuSelect");
    },
    //
    //*выход
    //
    async clickExit() {
      this.$router.push("/login?message=logout");
      await this.LOOUT_ACTION();
      this.isMtoast = true;
    },
  },
  computed: {
    ...mapGetters(["USER_INFO_GET"]),
  },
  async mounted() {
    this.USER_INFO_ACTION();
    //
    //*часы интервалом
    //
    this.dateDestroy = setInterval(() => {
      this.date = new Date().toLocaleString();
    }, 1000);
    //
    //*инициализация дропдауна
    //
    this.dropdownDestroy = M.Dropdown.init(document.getElementById("drop"), {
      constrainWidth: true,
    });
    //
    //*иниц-я модального окна
    //
    this.modal2 = await M.Modal.init(document.querySelector("#modal2"));
  },
  beforeDestroy() {
    //
    //*тост при выходе
    //
    if (this.isMtoast) {
      M.toast({ html: messages[this.$route.query.message] });
    }
    //
    //*уничтожение часов
    //
    clearInterval(this.dateDestroy);
    //
    //*уничтожение модального окна
    //
    if (this.modal2) {
      this.modal2.destroy();
    }
    //
    //*уничтожение дропдауна
    //
    if (this.dropdownDestroy != null) {
      this.dropdownDestroy.destroy();
    }

    this.isMtoast = false;
  },
};
</script>
<style lang="scss" scoped>
</style>