<template>
  <div v-if="training">
    <div class="p-3">
      <span class="text-gray-700">{{ training.date }}</span
      >&nbsp;
      <h1 class="text-xl inline">{{ training.topic }}</h1>
    </div>
    <div class="px-2 text-lg">
      <router-link
        class="inline-block px-2 border-b-4 hover:border-blue-400"
        :class="[$route.name === 'training.show' ? 'border-blue-600' : 'border-gray-200']"
        :to="{ name: 'training.show', params: { id } }"
        >Übersicht</router-link
      >
      <router-link
        class="inline-block px-2 border-b-4 hover:border-blue-400"
        :class="[$route.name === 'training.attendance' ? 'border-blue-600' : 'border-gray-200']"
        :to="{ name: 'training.attendance', params: { id } }"
        >Anwesenheitsliste</router-link
      >
    </div>
    <router-view :id="id" :attendees="attendees" />
  </div>
  <div class="py-4">
    <router-link to="/" class="text-blue-600 p-4 pl-0 hover:underline">← Zurück</router-link>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'

import { attendanceStore } from '@/store/automerge'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const training = computed(() => attendanceStore.getTraining(props.id))
    const attendees = attendanceStore.getPersonTrainingByTraining(toRef(props, 'id'))

    return {
      training,
      attendees,
    }
  },
})
</script>
