<template>
  <input type="checkbox" class="mr-2" v-model="state" :indeterminate="state != isChecked" />
</template>
<script lang="ts">
import { attendanceStore, PersonEntity } from '@/store/attendance'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    isChecked: {
      type: Boolean,
      required: true,
    },
    trainingId: {
      type: Number,
      required: true,
    },
    person: {
      type: Object as () => PersonEntity,
      required: true,
    },
  },
  setup(props) {
    const state = ref(props.isChecked)
    watch(state, () => {
      if (state.value) {
        attendanceStore.createPersonTraining(props.person, props.trainingId)
      } else {
        attendanceStore.deletePersonTraining(props.person.id, props.trainingId)
      }
    })
    return { state }
  },
})
</script>
