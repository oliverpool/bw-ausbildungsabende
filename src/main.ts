import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { useRegisterSW } from 'virtual:pwa-register/vue'
useRegisterSW()

createApp(App).use(router).mount('#app')
