<template>
  <div class="rounded bg-gray-100">
    <ul>
      <li
        v-for="(attendee, i) in attendees"
        :key="attendee.id"
        :class="{ 'bg-gray-50': i % 3 == 2 }"
      >
        <div class="py-2 inline-flex items-center">
          <label
            class="text-gray-700 inline-flex items-center px-3 cursor-pointer"
            :class="{
              'text-blue-700': attendee.type === 'AEK',
            }"
          >
            <AttendeeTrainingCheckbox
              :is-checked="isChecked(attendee.id)"
              :training-id="id"
              :attendee="attendee"
            />{{ attendee.type }}
          </label>
          &nbsp;<span class="text-lg">{{ attendee.firstname }} {{ attendee.lastname }}</span>
        </div>
      </li>
      <li class="px-3 py-2">
        {{ count }}
        <small class="text-gray-700">/ {{ attendees.length }}</small>
      </li>
    </ul>
  </div>
  <AttendeeCreate class="rounded bg-gray-100 my-3" :training-id="id" />
</template>
<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import AttendeeCreate from '../components/AttendeeCreate.vue'
import AttendeeTrainingCheckbox from '../components/AttendeeTrainingCheckbox.vue'
import { attendanceStore, AttendeeTrainingEntity } from '@/store/automerge'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    attendees: {
      type: Array as () => Array<AttendeeTrainingEntity>,
      required: true,
    },
  },
  components: { AttendeeCreate, AttendeeTrainingCheckbox },
  setup(props) {
    return {
      count: computed(() => props.attendees.length),
      attendees: attendanceStore.sortedAttendees,
      isChecked(id: string) {
        return !!props.attendees.find((pt) => pt.attendee_id === id)
      },
    }
  },
})
</script>
