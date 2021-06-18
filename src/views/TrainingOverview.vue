<template>
  <div class="rounded bg-gray-100 p-5">
    <table>
      <tbody>
        <tr class="font-bold border-b border-gray-400">
          <td class="px-2 py-1">Anwesend:</td>
          <td class="text-right pr-2" v-text="personTraining.length" />
        </tr>
        <tr v-for="(count, type) in countPerType" :key="type">
          <td v-text="type" class="px-2" />
          <td class="text-right pr-2" v-text="count" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from 'vue'
import { attendanceStore } from '@/store/attendance'

export default defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const personTraining = attendanceStore.getPersonTrainingByTraining(toRef(props, 'id'))
    const countPerType = computed(() => {
      const count: { [key: string]: number } = {}
      personTraining.value.forEach((pt) => {
        if (count[pt.type]) {
          count[pt.type]++
        } else {
          count[pt.type] = 1
        }
      })
      return count
    })
    return {
      personTraining,
      countPerType,
    }
  },
})
</script>
