<template>
  <router-link to="/" class="block p-3 pb-0 text-center font-bold sm:text-xl">{{
    $branding.title
  }}</router-link>
  <div class="bg-bergkette h-12 bg-center -mt-px" />
  <div class="justify-center flex-1 bg-white text-black pl-safe-area-inset pr-safe-area-inset">
    <div class="container mx-auto p-2" v-if="!isUpdating">
      <router-view />
    </div>
  </div>
  <div class="text-center text-xs bg-white text-gray-600 pb-safe-area-inset">
    <div v-if="saveErr" class="text-red-600 text-sm">{{ saveErr }}</div>
    <div v-if="needRefresh" class="text-green-600">Neue Version verfügbar</div>
    <div v-if="currentVersion > 1">
      <span v-if="savedVersion === currentVersion"
        >{{ Math.round(savedSize / 1024) }} KB gespeichert ✓
      </span>
      <span v-else
        >{{ currentVersion - savedVersion }} Änderung{{
          currentVersion == savedVersion + 1 ? '' : 'en'
        }}
        noch nicht gespeichert –
      </span>
      {{ APP_VERSION }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import { attendanceStore } from '@/store/automerge'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const isDirty = computed(() => {
      return (
        attendanceStore.currentVersion.value > 1 &&
        attendanceStore.savedVersion.value !== attendanceStore.currentVersion.value
      )
    })
    addEventListener(
      'beforeunload',
      (event) => {
        if (!isDirty.value) {
          return
        }
        event.preventDefault()
        return (event.returnValue = 'Are you sure you want to exit?')
      },
      { capture: true }
    )

    const { needRefresh, updateServiceWorker } = useRegisterSW()

    const isUpdating = ref(false)
    useRouter().afterEach(() => {
      if (isDirty.value || !needRefresh.value) {
        return
      }
      isUpdating.value = true
      setTimeout(() => {
        isUpdating.value = false
      }, 3000)
      updateServiceWorker()
    })

    const urlParams = new URLSearchParams(window.location.search)
    const stufe = urlParams.get('stufe') || 'automerge'
    const brandingBackground = {
      woelflinge: '#f56403',
      jungpfadfinder: '#2f53a7',
      pfadfinder: '#26823c',
      rover: '#ce2630',
    } as { [key: string]: string }
    if (brandingBackground[stufe]) {
      document.documentElement.style.backgroundColor = brandingBackground[stufe]
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', brandingBackground[stufe])
    }

    return {
      isUpdating,

      savedVersion: attendanceStore.savedVersion,
      savedSize: attendanceStore.savedSize,
      currentVersion: attendanceStore.currentVersion,
      saveErr: attendanceStore.saveErr,

      isDirty,
      needRefresh,

      APP_VERSION: _APP_VERSION,
    }
  },
})
</script>

<style>
.bg-bergkette {
  background-image: url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" width="2497.5" height="109.8" xmlns="http://www.w3.org/2000/svg"><path d="M1223.1 16.7c-.1 0-.4.9-1.6 2.7-.6.8-1.6 2.3-2.2 3.2-.5.7-1.5 1.8-2.1 3-1 2.1-2 2.1-2.1 2.1-.5.3-1.5 2.1-2.4 2.6-.2.2-1.1.6-1.4.7-.4.2-2.1.7-2.7.9-3.7 1.1-5.8 2.5-7.1 3-1.6.7-2 1.1-3.2 1.3-2.3.5-5.8 1.9-6.7 2-.6.1-1.7 1.3-2.6 1.7-1.4.7-2.6 1.2-3.6.5-.2-.1-1.7-.9-2-1.4-.5-.8-1.6-2.9-2-2.1-.4.8-1 .8-1.4 1.3-.6.8-.8.9-3.5 2.5-.7.4-1.4 1.1-2.4 1.6-.5.3-3.2 1.4-3.9 1.7-.5.3-3.1 1.8-3.3 1.9-5.4 2.6-8.9 8.5-13.2 10.4-1 .4-2 1-3.1.8-.6-.1-7.1.5-7.4.5-2.1.3-4.4 1-6.4 1-1.2 0-2.5-.3-3.4-.5-1-.2-1.7.3-2.8-.8-.5-.5-1.5-2.4-2-2.8-.4-.3-.7-1-1-1.1-.3 0-.3.6-.5.8-.2.1-.5 1.2-.6 1.6-.9 2.9-2 3.7-2.9 2.8-.5-.4-1-.3-1.6-.6-.2-.1-.5.6-1 .8-.4.2-1 1.2-1.2 1.4-1.3.9-2 2.6-3.9 4.1-1 .7-1.9 2.1-3 2.5-1.3.5-4.3.9-4.3.9-.7.6-9.5 2.5-9.9 2.3-1.8-1-3.5-2.3-4.6-3.3l-1-1c-.6-.7-.8-1.4-1.1-1.1-.2.2-.3.6-.5.8-1.1 1.6-5.9 3.5-8.1 4.9-2.2 1.4-6.1 5.3-10.2 6.8-.3-.2-3.2.9-4.9-.8-1.1-1.1-3.7-1.2-4.3-1.7-.9-.7-3.8-4.7-4.6-5.4-.7-.7-1.6-2.4-4.4-5.6-2.7-3.2-3.4-2.1-5.5-4.7-1.2-1.4-2 .7-2.9 2-1 1.4-1.4 1.2-2 2.3-.6 1.1-4.7 4.7-5.3 6-.6 1.3-1.9 1.3-2.3 1.9-.6.9-3.1 1.6-5.3 2.6-2 .9-2.3 3.4-3.7 3.5-1.4.1-6.3 3.6-6.7 3.8-10.2 4.8-13.9 5.7-15.7 7-1.8 1.2-6.6 1.9-7.3 3-.8 1.2-4 3-4.6 3.2-.9.3-5.8 4.5-6.4 4.6-1.8.3-1.1 1-3.3.8-2.2-.2-13.2-2-15.8-4.6-1.6-1.6-4-4-4.7-4.2-.5-.2-1.6.9-2.9 1.6-3.4 1.8-3.5 2.4-5.5 1.6-1.9-.8-3.3-1.5-5.7-3.6-2.5-2.1-1.2-1.2-4.1-2.8-3-1.6-5.7-3.9-6.3-4.5-2.7-2.9-1.2-.6-4.8-3-2.2-1.5-3.2 0-5.9-3.4-.4-.5-4-2.2-4.2-1.9-.6.9-2.8-4.1-5.1-5.7-.7-.4-2.4 2.9-3 2.8-1.5-.4-5.4 11.5-7.4 11-1.6-.3-3.2-2.9-3.7-2-2.5 4.4-9.1 10.1-10.3 10.9-1.2.8-5.3 1.4-6.9.5-1.7-1-3.1-1.8-4.1-2.6-.6-.5-.9-1.2-1.4-1.2-.3 0-.9.8-2.4 1.9-1.3.9-3.5 2-5.8 3.3-2.9 1.7-1.4.8-7.8 3.3-6.4 2.4-4.3 2.2-6.4 2.4-1.5.1-4.4 1.9-7.6 2.6-.6.1-6.1 2-11.3 2.1-5.2.1-8.3-4-10.6-5.2-4.1-2-4.2-3-4.9-3.4-.3-.2-.4.4-1.2 1-.7.5-1.9 1-2.5 1.7-.7.7-2-1.4-3.3-3.4-.5-.7-.6-1.7-1.1-2.1-.3-.3-.4.5-1.3 1.8-.3.5-1 .9-1.9 2-1.5 1.8-4.7 4.4-6.1 5.4-.4.3-.9.7-1.4 1.1-.4.3-5.7 5.6-7.7 5.9-1.8.3-2.1.9-2.9.9h1701.5V82.5s-4.2 2.2-7.2 4.3c-4.8 3.3-9.9 2.9-14.3 5.2-4.3 2.2-14.7 1.9-15.1 1.8-1.4-.4-4-.5-5.7-1.8-2.2-1.8-5.7-1.6-6.6-2.2-.5-.3-2.6-.2-3-.5-.9-.6-.7-1.1-2.1-2-2-1.3-1.5-.5-4.1 1.3-2.6 1.8-4.3 4.1-6.1 4.1-1.8 0-2.9-.3-5.4-2.4-2.4-2.1-1.9-.9-6.6-.7-4.7.1-4.3-.5-6.4-2-2-1.4-5.8-2.6-7.9-5.9-.8-1.3-1.7-2.7-2-2.3-.9 1-2 2.5-4.7 4.7-2.8 2.3-2 2.7-4.8 4.4-4.5 2.9-2.3 3.6-7 5-1.8.5-4.8 4.7-8.2 5.2-2.2.3-3.3-2.6-4.4-1-.5.8-2.3 1.6-6.7 4.4-4.4 2.8-4 1.5-6.1 1-2.2-.4-11.9-3.4-13.8-4.2-1.9-.8-3.9-4.3-4.5-3.9-.7.4-1.4 1.6-5.8 3.7-2.5 1.2-5.7 3.6-9.3 4.4-3.6.8-11.5 0-12.9-.3-3.4-.7-6.5-2.5-8.1-2.6-2.2-.1 0 0-6.8-2.4-6.7-2.5-5.2-1.7-8.3-3.3-3.2-1.6-4.9-2.9-6.5-4.7-1.5-1.8-2.7.4-8.1 3.2-5.3 2.7-5.3 3.1-6.9 2.9-1.5-.2-3.7-2.9-5.6-4-1.9-1.1-2.9-2.4-8-4.6-3.3-1.4-5-3.7-5.8-4.5-2.4-2.3-9.3-6.2-27.4-12.7-.4-.2-.9-.3-1.3-.7-1.1-.8-5.3-2.3-5.5-2.3-4.5-.6-7.9-5.9-9-7-.4-.4-.8-1.7-1.8-2.2-.4-.2-2.7-2.1-3.2-2.5-1-.6-2.9-2-3.8-2.7-.7-.8-1.7-2.4-4.7-5.6-2.9-3.2-3.6-2.1-5.9-4.7-.4-.3-.5-.8-.8-.7-.5.1-1.6 1.7-2.4 2.7-1.1 1.4-1.6 1.2-2.2 2.3-.6 1.1-5.1 4.7-5.7 6-.8 1.3-1.8 3.3-2.2 3.9-.6.9-4.7 4.4-5.7 5.1-.6.4-2.5 1.5-5.1 2.9-.4.2-1.1-.2-2.7 1-.7.6-1.4 1.6-1.6 1.8-.9.6-3.2 3.8-4.4 5.5-1.1 1.7-4.6 4.2-7.6 7.2-1.7 1.7-3.7 3.1-5.2 4.1-1 .7-1.9 1.1-2.2 1.4 0 0-2.4 1.3-3.6 2.9-.9 1.3-4.6 3.4-6.1 4.8-1.6 1.4-7.7 4.9-9.7 5.2-2 .3-3.2.3-3.6.8-.7.8-3.2 1.9-5.7 1.8-.7 0-1.4-.7-1.8-1.5-.1-.2-8.2-3.8-9.4-4.9-1.8-1.6-4.9-5-5.1-4.2-.3.7-1.7.9-3.1 1.6-3.6 1.8-3.9 2.4-5.9 1.6-2-.8-3.5-1.5-6.1-3.6-2.7-2.1-1.3-1.2-4.4-2.8-3.2-1.6-6.2-3.9-6.8-4.5-2.9-2.9-1.3-.6-5.2-3-2.4-1.5-3.2-2.6-6.4-4.7-1.4-.9-2.3-3.9-3.3-3.4-.3.2-1.2 1.6-1.8 2.5-.6 1.1-1.4 1.1-2.8 2.3-1.2 1-1.5 1.8-2.5 1.4-.9-.4-6.8 4-6.8 4s-3 3.3-5.8 4.5c-5.3 2.2-6.2 3.5-8.1 4.6-2 1.2-.2.9-4.9 2.5-1.4.5-3.4.1-5.1-.4-.7.9-1.8 2.2-3.2 4-2.5 3.3-4.4 4.6-4.4 4.6-1.7-.6-2.2-1.4-4.2-2.6-.5-.3-7.5 3.7-9 3.3-3.4-.8-6.4-3.2-8.7-4.4-4.1-2.1-4.7-3.3-5.4-3.7-.5-.4-2.4 3.1-4.2 3.9-1.8.8-3.1-1.2-3.6-.7-1.2 1.3-7.3 4.5-9.3 5-1.9.5-4.5-1-5.7-1-1.6 0-9.4-3.2-10.4-3.4-3.1-.4-5.9-4.6-7.7-5.2-4.5-1.4-2.3-2.1-6.6-5-2.5-1.8-1.9-2.1-4.5-4.4-2.5-2.2-3.6-3.7-4.4-4.7-.4-.4-1.2 1.1-1.9 2.3-1.9 3.2-5.4 4.4-7.4 5.9-1.9 1.5-1.9.4-6 2-1.7.6-3.9-1.2-4.1-1.5-.4-.6-1.2 1.3-2.1 2.1-2.3 2.2-8.4.2-10.8-1.6-1.5-1.1-2.4-2.9-2.8-2.6-.4.3-.3.7-1 1.2-1.3.9-1 1.3-2 2-.3.2-2.3.1-2.8.5-.7.6-4.1.4-6.2 2.2-1.6 1.4-3.8 0-5 .4-.2 0-2.3-.5-4.2-1.1-.8-.3-1.3-1.8-2.1-1.3-2.4 1.6-5.9 2.4-8.1 2-6.6-1.3-11.2-3.5-13.5-5.2-2.8-2.1-5.4-3.6-6.7-4.5-1.6-1.1-2.5-4.2-3.1-3.7-1.6 1.3-2.6 2.8-6.5 4.8s-4.5 3.1-7.9 4.2c-5.3 1.7-9.4 2.2-9.9 2.4-2.2 1-5.2-.8-6.1-.8-.8.1-4.5-3.4-5.9-3.8-.2 0-.6.5-.9.9-.3.4-2.7 2-4.3 2.4-1.3.4-4.3-2.6-4.6-2.8-2.8-2.1-4.5-4.6-4.7-5-.5-1.1-1.5 1.2-1.9 1.5-.7.6-1.6.6-3.2 1.9-1.2.9-2.7-.3-3.8 0-1.2.3-3.2-1.2-5.1-1.8-3.2-1.1-6.3-3.2-7.2-4.1-2.5-2.4-6.4-7.4-9.2-8.9-1.8-1.3-9.5-3.9-15.1-7.4-5.7-3.6-10.8-7-12.1-8.1-1.3-1.1-4.9-4-6-4.7-1.1-.6-3.4-2-4.4-2.7-1-.8-.4.3-4-2.9-1.6-1.4-2.4-1.2-5.1-3.4-2.6-2.2-.9-1.8-3.3-4.1-.3-.3-.8-.9-1.1-.9-.6 0-2 2-2.9 3-1.3 1.4-.8 1.1-1.6 2.2-.3.3-1.7 2.7-2.5 3.4-.7.6-1.8 2.9-2.6 3.2-1.4.6-4.8 2.7-5.3 3.3-.8.9-5.6 4.4-6.8 5.1-.7.4-3.8 2-7.1 2.7-.4.1-1.6 1.4-1.9 1.6-1.5.7-1.8 1.2-2.2 1.4-1.1.6-1.9 1.4-3.3 3.1-.8 1-4 .9-4.8.4-.2-.1-.3-.2-.4-.2-.6-.2-1.4.2-2.1-.1-.9-.4-3.6 1.4-4.8 3.7-.3.5-1.6 1.2-1.9 1.7-2.1 4.1-3.5 8.6-5.7 9.7 0 0-3.7 1.8-4.6 3.6-.5 1-6 3-7.3 4-.5.4-1.5 1-2.6 1.6-.7.4-7.4 3.4-8.6 3.6-2.3.3-3.5.6-4.2.8-.7.2-3.2 2.1-4.6 2.6-.3.1-.7-.1-1.4-.3-.8-.3-1.9-.8-3.3-1.4-.8-.4-3.1-1.3-4.2-1.7-2.5-1-5.4-2.8-6.6-3.8-2.4-1.8-4.2-5.3-5.5-5.8l-.4.6c-.6-.2-.9 1.7-2.6 2.4-1.1.5-3.1 1.1-3.8 1.4-2 .8-2.6 1-4.4.4-2.5-.8-4.2-1.5-7.3-3.6-3.1-2.1-1.4-1.2-5.2-2.8-3.7-1.6-7.2-3.9-8-4.5-3.5-2.9-1.6-.6-6.2-3-2.9-1.5-5-2.5-8.5-5.9-3-3-2-.6-4.8 1.3-1.2.8-6.2 5.4-8.7 6.5-1.8.8-3.5 1.9-5.7 2.6-.8.2-3.8.7-4.4.6-3.6-.6-3.9-1-4.9-1.7-1-.7-1-1.1-1.3-.7-.6.8-1.3 1.6-2.8 2.4-.9.4-3.5 2.8-4.4 3.4-3.2 2.1-4.3 2.7-5.3 3.2-2.3 1.1-2.4 3.3-8.9.5-2-.9-3.2-2-4.2-2.7-.3-.3-.9-.1-1.4-.6-.6-.5-1.2-1.7-1.5-1.7-.5 0-1.5 2-2.3 2.7-1 .8-1.7 1.7-3.4 2-1.7.4-3.8 1.3-4.7 1.7-3.7 1.7-1.8.9-10 3.3-1.6.4-6 2.3-8.2 2.4-1.9.1-5.6 1.9-9.7 2.6-.5.1-2 .3-3.9.4-2.2.1-10.5.1-11.7-.1-4.4-.8-16.5-3.5-21-3.3-4.5.2-10.8-1.9-13.9-2-.3 0-2.2 2.6-2.5 2.6-.1 0-.3.1-.4.1-1-.3-2.2-.8-3.5-1.5-3.2-1.8-4.2-3.4-5-3.5-.8-.1-2.2 2-5.1 3.8-2.9 1.8-5 2.9-7.8 2.8-2.1-.1-12.8-2-13.7-2.4-1.1-.6-6.7-3.1-7.7-3.8-3.2-2.2-4.6-3.7-5.6-4.7-.4-.4-1.5 1.1-2.4 2.3l-.1.1c-1-.5-1.9-.9-2.6-1.4-1.3-.8-7.5-4.3-12.2-6.4-.4-.2-.7-.3-.9-.4-1.8-1.1-6.7-5.6-7.5-4.4-1.6 2.3-2.4 4.1-9.1 2.6-5-1.1-15.6-10.8-20.6-13.5-8.4-4.4-9.6-8.7-10.2-8.9-.1 0-2.2-2.3-3.1-1.9-7 3.4-9.6 1.7-10.4 1.5-3.2-.7-4.5-3.4-7.7-4.9-4.6-2.2-11.1-11.6-12.2-10.8-1.6 1.1-3 3.3-4.9 6.2-2-1.8-4.7-4.3-6.5-6-.6-.6-1.3-2.9-2-3.2-1.5-.6-6-6-8.3-8.8-.3-.4-.8-.4-1.1-.8-1.4-1.6-2.8-3.2-3.8-4.3-1-1.2-1.8-3.5-2.6-3.5zM796 109.8c-3.2-.1-5.9-4.6-7.7-5.2-4.5-1.4-2.3-2.1-6.6-5-2.5-1.8-1.9-2.1-4.5-4.4-2.5-2.2-3.6-3.7-4.4-4.7-.4-.4-1.2 1.1-1.9 2.3-1.9 3.2-5.4 4.4-7.4 5.9-1.9 1.5-5.2 4.5-10.2 3.5-5.7-1.1-11.8-7.7-14.7-8.6-6-1.8-16.6-12.2-18.8-15-2.5-3.2-17.3-10.6-18.8-13-4.4-7.1-9.8-15.4-14.4-21-8.5-10.2-10.8-17.8-14-20.5-1.2-.9-7.7 9.9-12.2 12.4-3.1 1.8-4.5 4.8-7.7 5.6-.8.2-3.3-.8-3.9-.7-2.5.7-2.4 2.1-6.5-1-.8-.6-3 2.2-3.1 2.2-.7.2-1.8 5.1-10.2 10.3-5.2 3.2-12.8 13.9-17.6 15.4-6.7 2.1-10.6-.2-12.2-2.8-.9-1.4-5.7 3.8-7.5 5-.2.1-.5.3-.9.5-4.7 2.5-11 6.4-12.2 7.4-4 3.1-15.4 6.8-18.6 8.6-.9.5-11.6 2.6-13.7 2.7-2.7.1-4.9-1.2-7.8-3.3-3-2.1-4.3-4.5-5.1-4.4-.7.1-1.7 1.9-5 4s-5.5 2.2-7.2 2.7c-2.9.9-4.8-.1-6.9 1.2-3.4 2.1-6.6 1.4-7.7 1.9-1.1.5-4.3-.3-7.8-.7-2.4-.3-2 .5-7.5-1.5s-3.7-1.5-7-3.6c-3.2-2.1-4.2-3.9-5-4-.8-.1-2.2 2.3-5.1 4.4-3 2.2-2.8 1.7-5.6 1.5-2-.2-10.9.1-14.1-1.5-3.2-1.6-3.7-2.3-8.3-4.4-4.5-2.1-2.4-.6-6.5-2.1-4.1-1.4-3.4-1.3-6.2-2.9-2.7-1.6-2.7-.8-6.5-3.1-3.7-2.3-3.3-1.8-5.7-3.4-2.4-1.6-3.3-3.9-4.4-5.4-1.1-1.5-.8-1.4-4 3.7-3.2 5.2-2.6 6.2-5.8 9.2-1 .9-5.5 6.6-8.7 7.7-1.9.6-2.8-.2-4-.5-1.1-.2-2.5 0-3.7-.9-1.6-1.3-3.1-2.3-3.8-2.9-.4-.3-1.4-2.5-1.9-1.5-.2.4-1.9 2.9-4.7 5-.3.2-3.3 3.1-4.6 2.8-1.5-.4-4-2.1-4.3-2.4-.4-.4-.7-1-.9-.9-1.4.4-5 3.8-5.9 3.8-.9 0-4 1.8-6.1.8-.5-.2-4.6-.6-9.9-2.4-3.4-1.2-4-2.2-7.9-4.2-3.9-1.9-4.9-3.5-6.5-4.8-.6-.5-1.5 2.6-3.1 3.7-1.3.9-3.9 2.4-6.7 4.5-4.6 3.3-9.4 2.9-13.5 5.2-4.1 2.2-13.8 1.9-14.2 1.8-1.3-.4-3.7-.5-5.3-1.8-2.1-1.8-5.4-1.6-6.2-2.2-.5-.3-2.4-.2-2.8-.5-.9-.6-.7-1.1-2-2-1.8-1.3-1.4-.5-3.8 1.3s-4.1 4.1-5.7 4.1c-1.7 0-2.8-.3-5.1-2.4s-1.8-.9-6.2-.7c-4.4.1-4-.5-6-2-1.9-1.4-5.4-2.6-7.4-5.9-.8-1.3-1.6-2.7-1.9-2.3-.8 1-1.9 2.5-4.4 4.7-2.6 2.3-1.9 2.7-4.5 4.4-4.3 2.9-2.2 3.6-6.6 5-1.7.5-4.5 4.7-7.7 5.2-2 .3-3.1-2.6-4.1-1-.5.8-2.2 1.6-6.3 4.4-4.1 2.8-3.7 1.5-5.7 1-2.1-.4-11.2-3.4-13-4.2-1.8-.8-3.6-4.3-4.2-3.9-.6.4-1.3 1.6-5.4 3.7-2.3 1.2-5.3 3.6-8.7 4.4-3.5.8-10.9 0-12.2-.3-3.2-.7-6.1-2.5-7.6-2.6-2.1-.1 0 0-6.4-2.4-6.3-2.5-4.9-1.7-7.8-3.3-3-1.6-4.6-2.9-6.1-4.7-1.4-1.8-2.5.4-7.6 3.2-5 2.7-5 3.1-6.5 2.9-1.4-.2-3.4-2.9-5.2-4-1.8-1.1-2.7-2.4-7.5-4.6-2.6-1.1-3.4-3-5.4-4.5-2-1.5-4.7-3-4.7-3-2.5-1-5.9-2-7-3.8-.4-.7-1-2.5-1.5-2.6-.8-.2-1.5 1.7-2.8 2.6-2.9 2.2-3.7 3.2-5.9 4.7-3.7 2.4-11.9-6.7-13.5-7.2-6.7-2.3-15.6-19.1-16-19-.8.2-3.1 2.6-4.7 4.2-2.7 2.6-7.701 4.35-12.2 7.2-4.5 2.852-9.193 7.014-14.721 9.995C12.85 77.875 0 82.5 0 82.5v27.3h796z" fill="%23ffffff"/></svg>');
  background-size: auto 100%;
}
.pt-safe-area-inset {
  padding-top: env(safe-area-inset-top);
}
.pr-safe-area-inset {
  padding-right: env(safe-area-inset-right);
}
.pb-safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom);
}
.pl-safe-area-inset {
  padding-left: env(safe-area-inset-left);
}
</style>
