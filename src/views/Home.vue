<template>
  <details>
    <summary class="cursor-pointer p-4">Neuer Ausbildungsabend</summary>
    <TrainingCreate class="p-4 pt-0" />
  </details>
  <div>Letzte Ausbildungsabende:</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TrainingCreate from '../components/TrainingCreate.vue'

export default defineComponent({
  components: {
    TrainingCreate,
  },
  setup() {},
})
</script>
