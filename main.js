import App from './App'

import api from './utils/request.js'
import apiUrl from './utils/api.js'
Vue.prototype.api = api
Vue.prototype.url = apiUrl

import store from './store'

Vue.prototype.$store = store

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif