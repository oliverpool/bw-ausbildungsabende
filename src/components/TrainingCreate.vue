<template>
  <form @submit.prevent="submit" class="grid grid-cols-1 gap-4">
    <label>
      <span>Thema</span>
      <input class="block" type="text" v-model="values.topic" required />
    </label>
    <label>
      <span>Datum</span>
      <input class="block" type="date" v-model="values.date" required />
    </label>
    <div>
      <button type="submit" class="mt-4">Erstellen und Teilnehmer hinzufügen</button>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const values = reactive({
      topic: '',
      date: new Date().toISOString().substr(0, 10),
    })
    return {
      values,
      submit() {
        console.log('SubMIT')
      },
    }
  },
})
</script>
