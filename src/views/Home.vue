<template>
  <details class="rounded bg-gray-100 my-3">
    <summary class="cursor-pointer p-3 hover:bg-blue-100 rounded text-blue-700 font-bold">
      Neuer Ausbildungsabend
    </summary>
    <TrainingCreate class="p-3 pt-0" />
  </details>
  <div class="rounded bg-gray-100 p-3">
    <h3>Letzte Ausbildungsabende:</h3>
    TODO
  </div>
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
