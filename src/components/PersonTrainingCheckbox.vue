<template>
  <input type="checkbox" class="mr-2" v-model="state" :indeterminate="state != isChecked" />
</template>
<script lang="ts">
import { attendanceStore, PersonEntity } from '@/store/automerge'
import { TableRow } from 'automerge'
import { defineComponent, ref, watch } from 'vue'

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
    person: {
      type: Object as () => PersonEntity & TableRow,
      required: true,
    },
  },
  setup(props) {
    const state = ref(props.isChecked)
    watch(state, () => {
      if (state.value) {
        attendanceStore.createPersonTraining(props.person.id, props.person.type, props.trainingId)
      } else {
        attendanceStore.deletePersonTraining(props.person.id, props.trainingId)
      }
    })
    return { state }
  },
})
</script>
