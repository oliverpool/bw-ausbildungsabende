<template>
  <div class="justify-center flex-1 px-2">
    <div class="container pt-8 mx-auto">
      <router-link to="/">Ausbildungsabende - Bergwacht Bad Tölz</router-link>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
