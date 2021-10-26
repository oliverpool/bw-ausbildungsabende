import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import branding from '@branding'

useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update()
      }, 24 * 60 * 60 * 1000)
  },
})

const app = createApp(App).use(router)

app.config.globalProperties.$branding = branding

app.mount('#app')

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $branding: typeof branding
  }
}
