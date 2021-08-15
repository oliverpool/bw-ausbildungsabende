<template>
  <input type="checkbox" class="mr-2" v-model="state" :indeterminate="state != isChecked" />
</template>
<script lang="ts">
import { attendanceStore, AttendeeEntity } from '@/store/automerge'
import { TableRow } from 'automerge'
import { defineComponent, nextTick, ref, watch } from 'vue'

export default defineComponent({
  props: {
    isChecked: {
      type: Boolean,
      required: true,
    },
    trainingId: {
      type: String,
      required: true,
    },
    attendee: {
      type: Object as () => AttendeeEntity & TableRow,
      required: true,
    },
  },
  setup(props) {
    const state = ref(props.isChecked)
    watch(state, () => {
      if (state.value == props.isChecked) {
        return
      }
      if (state.value) {
        attendanceStore.createAttendeeTraining(
          props.attendee.id,
          props.attendee.type,
          props.trainingId
        )
      } else {
        attendanceStore.deleteAttendeeTraining(props.attendee.id, props.trainingId)
      }
    })
    watch(attendanceStore.currentVersion, () => {
      nextTick(() => {
        if (state.value == props.isChecked) {
          return
        }
        state.value = props.isChecked
      })
    })
    return { state }
  },
})
</script>
