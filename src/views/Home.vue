<template>
  <TrainingCreate class="rounded bg-gray-100 mb-3" />
  <div class="rounded bg-gray-100 p-3 mb-3" v-if="latestTrainings.length > 0">
    <h3 class="text-sm text-gray-700">Letzte Ausbildungsabende</h3>
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
  <div class="rounded bg-gray-100 p-3 mb-3">
    <h3 class="text-sm text-gray-700">Einsatzkräfte</h3>
    <PersonOverview :persons="persons" />
    <br />
    <router-link to="/einsatzkraefte" class="text-blue-600 p-4 pl-0 hover:underline">
      Einsatzkräfte verwalten
    </router-link>
  </div>
  <div class="rounded bg-gray-100 p-3 mb-3"><ImportExport /></div>
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
