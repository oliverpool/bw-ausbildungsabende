<template>
  <div class="rounded bg-gray-100 p-5">
    <AttendeeOverview :attendees="attendees" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AttendeeTrainingEntity } from '@/store/automerge'
import AttendeeOverview from '@/components/AttendeeOverview.vue'

export default defineComponent({
  components: { AttendeeOverview },
  props: {
    attendees: {
      type: Array as () => Array<AttendeeTrainingEntity>,
      required: true,
    },
  },
})
</script>
