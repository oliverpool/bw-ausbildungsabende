<template>
  <div class="rounded bg-gray-100 p-3">
    <AttendeeTableTotal label="Anwesend" :attendees="attendees" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AttendeeTrainingEntity } from '@/store/automerge'
import AttendeeTableTotal from '@/components/AttendeeTableTotal.vue'

export default defineComponent({
  components: { AttendeeTableTotal },
  props: {
    attendees: {
      type: Array as () => Array<AttendeeTrainingEntity>,
      required: true,
    },
  },
})
</script>
