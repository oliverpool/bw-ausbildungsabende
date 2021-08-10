import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'
import Training from './views/Training.vue'
import TrainingShow from './views/TrainingOverview.vue'
import TrainingAttendance from './views/TrainingAttendance.vue'
import FormerAttendees from './views/FormerAttendees.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  {
    path: '/ausbildungabend/:id',
    component: Training,
    props(route) {
      return { id: route.params.id }
    },
    children: [
      {
        path: '',
        component: TrainingShow,
        name: 'training.show',
      },
      {
        path: 'anwesenheit',
        component: TrainingAttendance,
        name: 'training.attendance',
      },
    ],
  },
  { path: '/ehemalige', component: FormerAttendees },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
