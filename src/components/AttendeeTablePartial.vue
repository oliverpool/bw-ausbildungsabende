<template>
  <table>
    <tbody>
      <tr class="font-bold border-b border-gray-400">
        <td class="px-2 py-1">{{ label }}</td>
        <td class="text-right pr-1" v-text="partial" />
        <td class="pr-2 text-gray-700 text-sm">/ {{ total }}</td>
      </tr>
      <tr v-for="(count, type) in countPerType" :key="type">
        <td v-text="type" class="px-2" />
        <td class="text-right pr-1" v-text="presentPerType[type] || 0" />
        <td class="pr-2 text-gray-700 text-sm">/ {{ count }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    attendees: {
      type: Array as () => Array<{ id: string; type: string }>,
      required: true,
    },
    presentTypes: {
      type: Object as () => { [key: string]: string },
      required: true,
    },
    label: {
      type: String,
      default: 'Total',
    },
  },
  setup(props) {
    const countPerType = computed(() => {
      const count: { [key: string]: number } = {}
      props.attendees.forEach((pt) => {
        if (count[pt.type]) {
          count[pt.type]++
        } else {
          count[pt.type] = 1
        }
      })
      Object.values(props.presentTypes).forEach((type) => {
        if (!count[type]) {
          count[type] = 0
        }
      })
      return count
    })
    const presentPerType = computed(() => {
      const count: { [key: string]: number } = {}
      Object.values(props.presentTypes).forEach((type) => {
        if (count[type]) {
          count[type]++
        } else {
          count[type] = 1
        }
      })
      return count
    })
    return {
      total: computed(() => props.attendees.length),
      partial: computed(() => Object.values(props.presentTypes).length),
      countPerType,
      presentPerType,
    }
  },
})
</script>
