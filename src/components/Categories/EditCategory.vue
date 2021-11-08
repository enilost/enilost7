<template >
  <div>
    <div class="page-subtitle">
      <h4>{{ $t("Edit") }}</h4>
    </div>

    <form @submit.prevent="editCtgr">
      <div class="input-field">
        <select id="slct" v-model="sel" @change="selectClick">
          <option value="" disabled selected v-if="CATEGORIES_GETT.length">
            {{ $t("Select a category") }}
          </option>
          <option value="" disabled selected v-else>
            {{ $t("No categories") }}
          </option>
          <option
            v-for="cat in CATEGORIES_GETT"
            :key="cat.id"
            v-bind:value="cat"
          >
            <span>{{ cat.name }}</span>
          </option>
        </select>
        <label>{{ $t("Select a category") }}</label>
      </div>

      <div class="input-field" :class="{ hide: !this.sel.id }">
        <input type="text" id="name2" v-model="name" />
        <label for="name2" :class="{ active: name }">
          {{ $t("Category name") }}
        </label>
        <span class="helper-text invalid" v-if="this.$v.name.$error">
          {{ $t("Enter a name") }}
        </span>
      </div>

      <div class="input-field" :class="{ hide: !this.sel.id }">
        <input
          id="limit2"
          type="number"
          v-model="limit"
          onkeydown="return event.keyCode !== 69"
        />
        <label for="limit2" :class="{ active: limit }">{{ $t("Limit") }}</label>
        <span class="helper-text invalid" v-show="this.$v.limit.$error">
          {{
            $t("Minimum limit", {
              min: '"' + this.$v.limit.$params.minValue.min + '"',
            })
          }}
        </span>
      </div>

      <button
        class="btn waves-effect waves-light"
        type="submit"
        :class="{ hide: !this.sel.id }"
      >
        {{ $t("Edit") }}
        <i class="material-icons right">send</i>
      </button>

      <br /><br />
      <div>
        <!-- Modal Trigger -->
        <a
          class="waves-effect waves-light btn modal-trigger"
          :class="{ hide: !this.sel.id }"
          href="#modal1"
          @click="modal.open()"
        >
          {{ $t("Delete") }}
          <i class="material-icons right">delete_forever</i></a
        >

        <!-- Modal Structure -->
        <div id="modal1" class="modal">
          <div class="modal-content">
            <h4>{{ $t("Are you sure") }} "{{ name }}"?</h4>
            <p></p>
          </div>
          <div class="modal-footer">
            <a
              class="waves-effect waves-light btn"
              @click.prevent="deleteCtgr"
              >{{ $t("Delete") }}</a
            >
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">
              {{ $t("Cancel") }}
            </a>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import M from "materialize-css/dist/js/materialize.min.js";

import { required, minValue } from "vuelidate/lib/validators";

export default {
  name: "EditCategory",
  components: {},
  data() {
    return {
      MSelect: false,
      sel: {},
      name: "",
      limit: "",
      modal: false,
    };
  },
  methods: {
    ...mapActions([
      "EDIT_CATEGORIES_ACTION",
      "DELETE_CATEGORY_ACTION",
      "CATEGORIES_ACTION",
    ]),
    //
    //*клик по селекту заполняет переменные
    //
    async selectClick() {
      this.name = this.sel.name;
      this.limit = this.sel.limit;
    },
    //
    //*клик по редактированию категории
    //
    async editCtgr() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        await this.EDIT_CATEGORIES_ACTION({
          name: this.name,
          limit: this.limit,
          id: this.sel.id,
        });
        M.toast({
          html: `Категория "${this.sel.name}" обновлена на "${this.name}"`,
        });
        this.name = null;
        this.limit = null;
        this.sel = {};
        this.$v.$reset();
      } catch (error) {
        console.log(error);
      }
    },
    //
    //*клик по удалению категории
    //
    async deleteCtgr() {
      this.modal.close();
      try {
        await this.DELETE_CATEGORY_ACTION({
          name: this.sel.name,
          limit: this.sel.limit,
          id: this.sel.id,
        });
        M.toast({
          html: `${this.$t("Category removed", {
            name: '"' + this.sel.name + '"',
          })}`,
        });
        this.sel = {};
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters(["CATEGORIES_GETT"]),
  },
  watch: {
    //
    //*при заполнении геттера уничтожает и заново создает нормалайз селект, чтоб он корректно пересчитался для v-for
    //
    CATEGORIES_GETT() {
      this.$nextTick(() => {
        if (this.MSelect) {
          this.MSelect.destroy();
          this.MSelect = M.FormSelect.init(document.getElementById("slct"));
        }
      });
    },
  },
  validations: {
    name: { required },
    limit: { required, minValue: minValue(100) },
  },
  async mounted() {
    //
    //*создаю селект и модалку
    //
    this.MSelect = await M.FormSelect.init(document.getElementById("slct"));
    this.modal = await M.Modal.init(document.querySelector("#modal1"));
  },
  destroyed() {
    //
    //*уничтожаю селект и модалку
    //
    if (this.MSelect) {
      this.MSelect.destroy();
    }
    if (this.modal) {
      this.modal.destroy();
    }
  },
};
</script>
<style lang="" >
</style>

