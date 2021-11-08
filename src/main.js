import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/router.js'
import store from './store/store.js'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import { i18n } from './i18n/i18n'
import VueMeta from 'vue-meta'

import 'materialize-css/dist/js/materialize.min.js'
import tooltip from '@/directive/tooltip.js'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
// eslint-disable-next-line no-unused-vars
import vueapexcharts from 'vue-apexcharts'


firebase.initializeApp({
  apiKey: "AIzaSyAhevC6hi817ItknRu6EqM3Mext5Bs0NXw",
  authDomain: "vue-cpa.firebaseapp.com",
  projectId: "vue-cpa",
  storageBucket: "vue-cpa.appspot.com",
  messagingSenderId: "433784702296",
  appId: "1:433784702296:web:724d8d981c475ee6be112d",
  measurementId: "G-2K7Y5HGTEN",
  databaseURL: "https://vue-cpa-default-rtdb.europe-west1.firebasedatabase.app"
});

Vue.config.productionTip = false
Vue.use(VueMeta)
Vue.use(Vuelidate)
Vue.use(vueapexcharts)
Vue.directive('ToolTip', tooltip)
Vue.component('Paginate', Paginate)
// Vue.component('Chart', Chart)
let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      i18n,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

});



//EvBus
// export const EvBus = new Vue();
