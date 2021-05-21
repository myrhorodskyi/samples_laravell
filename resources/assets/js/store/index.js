import Vue from 'vue'
import Vuex from 'vuex'

import Pages from './pages'
import Modules from './modules'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
      ...Pages,
      ...Modules
  }
})
