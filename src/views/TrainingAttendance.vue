<template>
  <div class="rounded bg-gray-100 sm:flex">
    <div class="p-3 pr-0 min-w-40">
      <AttendeeTablePartial :attendees="sortedAttendees" :present-types="presentTypes" />
    </div>
    <ul class="flex-auto">
      <li
        v-for="(attendee, i) in sortedAttendees"
        :key="attendee.id"
        :class="{ 'bg-gray-50': i % 3 == 2 }"
      >
        <div class="py-2 inline-flex items-center">
          <label
            class="text-gray-700 inline-flex items-center px-3 cursor-pointer"
            :class="{
              'text-blue-700': (presentTypes[attendee.id] || attendee.type) === 'AEK',
            }"
          >
            <AttendeeTrainingCheckbox
              :is-checked="!!presentTypes[attendee.id]"
              :training-id="id"
              :attendee="attendee"
            />
            {{ presentTypes[attendee.id] || attendee.type }}
          </label>
          &nbsp;<span class="text-lg"
            >{{ attendee.firstname }}
            <span class="text-gray-700">{{ attendee.lastname }}</span>

            <small
              class="text-gray-700"
              v-if="presentTypes[attendee.id] && presentTypes[attendee.id] !== attendee.type"
            >
              (mittlerweile {{ attendee.type }})
            </small>
          </span>
        </div>
      </li>
    </ul>
  </div>
  <AttendeeCreate class="rounded bg-gray-100 my-3" :training-id="id" />
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import AttendeeCreate from '../components/AttendeeCreate.vue'
import AttendeeTrainingCheckbox from '../components/AttendeeTrainingCheckbox.vue'
import AttendeeTablePartial from '@/components/AttendeeTablePartial.vue'

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
  components: { AttendeeCreate, AttendeeTrainingCheckbox, AttendeeTablePartial },
  setup(props) {
    const presentTypes = computed(() =>
      props.attendees.reduce((acc, current) => {
        acc[current.attendee_id] = current.type
        return acc
      }, {} as { [key: string]: string })
    )
    return {
      sortedAttendees: attendanceStore.sortedAttendees,
      presentTypes,
    }
  },
})
</script>
