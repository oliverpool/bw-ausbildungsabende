<template>
  <table>
    <tbody>
      <tr class="font-bold border-b border-gray-400">
        <td class="px-2 py-1">{{ label }}</td>
        <td class="text-right pr-2" v-text="total" />
      </tr>
      <tr v-for="(count, type) in countPerType" :key="type">
        <td v-text="type" class="px-2" />
        <td class="text-right pr-2" v-text="count" />
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    attendees: {
      type: Array as () => Array<{ type: string }>,
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
      return count
    })
    return {
      total: computed(() => props.attendees.length),
      countPerType,
    }
  },
})
</script>
