<template>
  <div class="p-3">
    <h1 class="text-xl inline">{{ attendees.length }} ehemalige Einsatzkräfte</h1>
  </div>
  <div class="rounded bg-gray-100 mb-3">
    <ul class="flex-auto">
      <li
        v-for="(attendee, i) in attendees"
        :key="attendee.id"
        :class="{ 'bg-gray-50': i % 3 == 2 }"
      >
        <div class="py-2 pl-2 flex items-center">
          <AttendeeEditable :attendee="attendee" />
        </div>
      </li>
    </ul>
  </div>
  <div class="py-4">
    <router-link to="/anwesenheit" class="text-blue-600 p-4 pl-0 hover:underline">← Zurück</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { attendanceStore } from '@/store/automerge'
import AttendeeEditable from '@/components/AttendeeEditable.vue'

export default defineComponent({
  components: {
    AttendeeEditable,
  },
  setup() {
    return {
      attendees: attendanceStore.getSortedAttendees((a) => a.type == '×'),
    }
  },
})
</script>
