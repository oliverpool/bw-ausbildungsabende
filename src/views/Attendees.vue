<template>
  <div class="p-3">
    <h1 class="text-xl inline">Einsatzkräfte</h1>
  </div>
  <div class="rounded bg-gray-100 p-3">
    <PersonOverview :persons="persons" />
  </div>
  <div class="py-4">
    <router-link to="/" class="text-blue-600 p-4 pl-0 hover:underline">← Zurück</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TrainingCreate from '../components/TrainingCreate.vue'
import ImportExport from '../components/ImportExport.vue'

import { attendanceStore } from '@/store/automerge'
import PersonOverview from '@/components/PersonOverview.vue'

export default defineComponent({
  components: {
    TrainingCreate,
    ImportExport,
    PersonOverview,
  },
  setup() {
    return {
      persons: attendanceStore.sortedPersons,
      today: new Date().toISOString().substr(0, 10),
      latestTrainings: attendanceStore.latestTrainings,
    }
  },
})
</script>
