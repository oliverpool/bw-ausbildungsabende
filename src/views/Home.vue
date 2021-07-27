<template>
  <TrainingCreate class="rounded bg-gray-100 mb-3" />
  <div class="rounded bg-gray-100 p-3 mb-3" v-if="latestTrainings.length > 0">
    <h3 class="text-sm">Letzte Ausbildungsabende:</h3>
    <ul>
      <li v-for="training in latestTrainings" :key="training.id">
        <router-link
          :to="{ name: 'training.show', params: { id: training.id } }"
          class="py-3 block underline text-gray-700"
          :class="{
            'text-blue-700': training.date === today,
          }"
        >
          <span
            :class="{
              'font-bold': training.date === today,
            }"
            >{{ training.date }}</span
          >
          &nbsp;<span class="text-lg text-black">{{ training.topic }}</span>
        </router-link>
      </li>
    </ul>
  </div>
  <div class="rounded bg-gray-100 p-3 mb-3s"><ImportExport /></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TrainingCreate from '../components/TrainingCreate.vue'
import ImportExport from '../components/ImportExport.vue'

import { attendanceStore } from '@/store/automerge'

export default defineComponent({
  components: {
    TrainingCreate,
    ImportExport,
  },
  setup() {
    return {
      today: new Date().toISOString().substr(0, 10),
      latestTrainings: attendanceStore.latestTrainings,
    }
  },
})
</script>
