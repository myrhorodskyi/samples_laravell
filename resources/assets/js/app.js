import Vue from 'vue'
import './bootstrap'
import { sync } from 'vuex-router-sync'
import './filters'
import './zone_name'
import store from './store'
import routes from './routes'
import makeRouter from './util/router'
import App from './components/App.vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'babel-polyfill'
import './util/extentions'
import VueCookie from 'vue-cookie'
import MetaInfo from 'vue-meta-info'

export const router = makeRouter(routes)
export const EventBus = new Vue()

sync(store, router)
Vue.use(VueMaterial)
Vue.use(VueCookie)
Vue.use(MetaInfo)

new Vue({
  store,
  router,
  ...App,
  el: '#app'
})
