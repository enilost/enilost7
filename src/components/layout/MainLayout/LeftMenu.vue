<template>
  <ul class="sidenav app-sidenav">
    <li :class="{ active: $route.path === '/' }">
      <router-link :to="{ name: 'Home' }">{{ $t("Home") }}</router-link>
    </li>
    <li :class="{ active: $route.path === '/history' }">
      <router-link :to="{ name: 'History' }">{{ $t("History") }}</router-link>
    </li>
    <li :class="{ active: $route.path === '/planning' }">
      <router-link :to="{ name: 'Planning' }">{{ $t("Planning") }}</router-link>
    </li>
    <li :class="{ active: $route.path === '/record' }">
      <router-link :to="{ name: 'Record' }">{{ $t("New entry") }}</router-link>
    </li>
    <li :class="{ active: $route.path === '/categories' }">
      <router-link :to="{ name: 'Categories' }">
        {{ $t("Categories") }}
      </router-link>
    </li>
    <li v-for="(l, i) in localization" :key="i">
      <a>
        <p>
          <label>
            <input
              name="group1"
              type="radio"
              :value="l"
              v-model="$i18n.locale"
            />

            <span>{{ l }}</span>
          </label>
        </p>
      </a>
    </li>
  </ul>
</template>


<script>
//
//*добавил в левое меню горячую смену зяыка, которая есть и в профиле(но его хрен найдешь)
//*при смене перерендерится весь компонент, т.к. везде используется нормалайз, а без перерендера он не
//*обновляет опшены в селектах кастомные директивы и тд, хотя многое локализуется и без перерендера, но не все
//* ключ :key="this.$i18n.locale" в App.vue
export default {
  name: "LeftMenu",
  data() {
    return {
      localization: ["en", "ru"],
    };
  },
  methods: {},
  watch: {},
  mounted() {},
};
</script>