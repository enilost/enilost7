import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import FirebaseLogin from '@/store/firebaseLogReg.js'
import userInfo from '@/store/userInfo.js'
import axiosRate from '@/store/axiosRate'
import categories from '@/store/categories.js'
import record from '@/store/record.js'
// console.log(axios);
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error

    },
    CLEAR_ERROR(state) {
      state.error = null
    },
  },
  actions: {
  },
  getters: {
    ERROR_GET(state) {
      return state.error
    }
  },
  modules: {
    FirebaseLogin,
    userInfo,
    axiosRate,
    categories,
    record
  }
});
