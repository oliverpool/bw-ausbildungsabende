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
        >Anwesenheit</router-link
      >
    </div>
    <router-view :id="id" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

import { attendanceStore } from '@/store/attendance'

export default defineComponent({
  props: ['id'],
  setup(props) {
    const training = computed(() => attendanceStore.getTraining(props.id))

    return {
      training,
    }
  },
})
</script>
