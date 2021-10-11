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
  <div class="rounded bg-gray-100 mb-3 sm:flex">
    <div class="p-3">
      <h3 class="text-sm text-gray-700">Einsatzkräfte</h3>
      <AttendeeTableTotal :attendees="attendees" />
      <br />
      <router-link to="/ehemalige" class="text-blue-600 p-4 pl-0 hover:underline">
        Ehemalige Einsatzkräfte
      </router-link>
    </div>
  </div>
  <div class="rounded bg-gray-100 mb-3">
    <details ref="attendanceDetails" class="flex-auto">
      <summary class="text-sm text-gray-700 p-3">
        <span class="inline-block mr-4">Einsatzkraft-Liste hinzufügen</span>
      </summary>
      <div class="px-3">
        <AttendeeImport @imported="foldAttendanceDetails" />
      </div>
    </details>
  </div>
  <div class="rounded bg-gray-100 mb-3"><ImportExport /></div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, Ref } from 'vue'
import TrainingCreate from '../components/TrainingCreate.vue'
import ImportExport from '../components/ImportExport.vue'

import { attendanceStore } from '@/store/automerge'
import AttendeeTableTotal from '@/components/AttendeeTableTotal.vue'
import AttendeeImport from '@/components/AttendeeImport.vue'

export default defineComponent({
  components: {
    TrainingCreate,
    ImportExport,
    AttendeeTableTotal,
    AttendeeImport,
  },
  setup() {
    const attendanceDetails: Ref<HTMLDetailsElement | null> = ref(null) //from the DOM

    return {
      attendees: attendanceStore.getSortedAttendees(),
      today: new Date().toISOString().substr(0, 10),
      latestTrainings: attendanceStore.latestTrainings,
      attendanceDetails,
      foldAttendanceDetails() {
        if (attendanceDetails.value) {
          attendanceDetails.value.removeAttribute('open')
        }
        nextTick(() => alert('Erfolgreich importiert!'))
      },
    }
  },
})
</script>
