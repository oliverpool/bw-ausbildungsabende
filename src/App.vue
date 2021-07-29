<template>
  <div class="justify-center flex-1">
    <router-link
      to="/"
      class="block p-3 pb-0 text-white bg-blue-bw text-center font-bold sm:text-xl"
      >Ausbildungsabende - Bergwacht Bad Tölz</router-link
    >
    <div class="bg-bergkette h-12 bg-center -mt-px" />
    <div class="container mx-auto p-2">
      <router-view />
    </div>
  </div>
  <div class="text-center text-xs text-gray-600">
    <div v-if="saveErr" class="text-red-600 text-sm">{{ saveErr }}</div>
    <div v-if="currentVersion > 1">
      <span v-if="savedVersion === currentVersion"
        >{{ Math.round(savedSize / 1024) }} KB gespeichert ✓</span
      >
      <span v-else
        >{{ currentVersion - savedVersion }} Änderung{{
          currentVersion == savedVersion + 1 ? '' : 'en'
        }}
        noch nicht gespeichert</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { attendanceStore } from '@/store/automerge'
export default defineComponent({
  setup() {
    return {
      savedVersion: attendanceStore.savedVersion,
      savedSize: attendanceStore.savedSize,
      currentVersion: attendanceStore.currentVersion,
      saveErr: attendanceStore.saveErr,
    }
  },
})
</script>

<style>
.bg-bergkette {
  background-image: url('./assets/bergkette.svg');
  background-size: auto 100%;
}
</style>
