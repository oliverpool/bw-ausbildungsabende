<template>
  <div class="justify-center flex-1 px-2">
    <div class="container mx-auto">
      <router-link to="/" class="block p-3">Ausbildungsabende - Bergwacht Bad Tölz</router-link>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
