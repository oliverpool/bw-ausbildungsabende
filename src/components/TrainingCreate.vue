<template>
  <form @submit.prevent="submit" class="grid grid-cols-1 gap-4">
    <label>
      <span class="text-gray-700">Thema</span>
      <input class="block w-64" type="text" v-model="values.topic" required />
    </label>
    <label>
      <span class="text-gray-700">Datum</span>
      <input class="block w-64" type="date" v-model="values.date" required />
    </label>
    <div>
      <button type="submit" class="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full">Erstellen und Teilnehmer hinzufügen</button>
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
