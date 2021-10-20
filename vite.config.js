import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import { VitePWA } from 'vite-plugin-pwa'

let branding = require('./src/branding/default').default
let publicDir = 'public'
if (process.env.BRANDING === 'dpsg') {
  branding = require('./src/branding/dpsg').default
  publicDir = 'public-dpsg'
  console.log('DPSG branding', branding.html)
}

function injectBranding() {
  const virtualFileId = '@branding'
  return {
    name: 'inject-branding',
    // inject into index.html
    transformIndexHtml(html) {
      return html.replace(/%(.*?)%/g, function (match, p1) {
        return branding.html[p1]
      })
    },
    // inject as @branding
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId
      }
    },
    load(id) {
      if (id === virtualFileId) {
        return 'export default ' + JSON.stringify(branding.vue)
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), VitePWA(branding.pwaConfig), injectBranding()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  },
  base: '/',
  publicDir,
  build: {
    cssCodeSplit: false,
  },
})
