import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from './views/Index.vue'
import Training from './views/Training.vue'
import TrainingShow from './views/TrainingOverview.vue'
import TrainingAttendance from './views/TrainingAttendance.vue'

import FormerAttendees from './views/FormerAttendees.vue'
import AttendeesAttendance from './views/AttendeesAttendance.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index },
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
  { path: '/anwesenheit', component: AttendeesAttendance },
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
