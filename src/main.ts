import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { useRegisterSW } from 'virtual:pwa-register/vue'
useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update()
      }, 24 * 60 * 60 * 1000)
  },
})

createApp(App).use(router).mount('#app')
