<template>
  <div class="justify-center flex-1">
    <router-link to="/" class="block p-3 pb-0 text-white bg-blue-bw text-center font-bold"
      >Ausbildungsabende - Bergwacht Bad Tölz</router-link
    >
    <div class="bg-bergkette h-12 bg-center -mt-px" />
    <div class="container mx-auto p-2">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style>
.bg-bergkette {
  background-image: url('./assets/bergkette.svg');
  background-size: auto 100%;
}
</style>
