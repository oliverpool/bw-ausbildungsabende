<template>
  <form @submit.prevent="submit" class="grid grid-cols-1 gap-4">
    <label>
      <span class="text-gray-700">Thema</span>
      <input class="block w-64" type="text" v-model="values.topic" required autofocus />
    </label>
    <label>
      <span class="text-gray-700">Datum</span>
      <input class="block w-64" type="date" v-model="values.date" required />
    </label>
    <div>
      <button
        type="submit"
        class="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full"
      >
        Erstellen und Teilnehmer hinzufügen
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { attendanceStore } from '@/store/attendance'
import router from '@/router'

export default defineComponent({
  setup() {
    const values = reactive({
      topic: '',
      date: new Date().toISOString().substr(0, 10),
    })
    return {
      values,
      submit() {
        const v = { ...values, id: 0 }
        const training = attendanceStore.trainingCreate(v)
        values.topic = ''
        values.date = new Date().toISOString().substr(0, 10)
        router.push({ name: 'training.attendance', params: { id: training.id } })
      },
    }
  },
})
</script>
