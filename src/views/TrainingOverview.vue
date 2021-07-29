<template>
  <div class="rounded bg-gray-100 p-5">
    <PersonOverview :persons="attendees" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PersonTrainingEntity } from '@/store/automerge'
import PersonOverview from '@/components/PersonOverview.vue'

export default defineComponent({
  components: { PersonOverview },
  props: {
    attendees: {
      type: Array as () => Array<PersonTrainingEntity>,
      required: true,
    },
  },
})
</script>
