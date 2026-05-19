import Vue from 'vue'
import Vuex from 'vuex'
import login from './module/login'
import userManager from './module/userManager'
import car from './module/car'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    userManager,
    car
  }
})
