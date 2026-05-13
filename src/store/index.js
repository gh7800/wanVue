import Vue from 'vue'
import Vuex from 'vuex'
import login from './module/login'
import userManager from './module/userManager'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    userManager
  }
})
