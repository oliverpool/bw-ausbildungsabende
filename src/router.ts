import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Training from './views/Training.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ausbildungabend', component: Training },
]

export default createRouter({
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})
