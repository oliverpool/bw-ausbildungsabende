<template>
  <div class="rounded bg-gray-100">
    <ul>
      <li v-for="(person, i) in persons" :key="person.id" :class="{ 'bg-gray-50': i % 3 == 2 }">
        <div class="py-2 inline-flex items-center">
          <label
            class="text-gray-700 inline-flex items-center px-3 cursor-pointer"
            :class="{
              'text-blue-700': person.type === 'AEK',
            }"
          >
            <input type="checkbox" class="mr-2" />{{ person.type }}
          </label>
          &nbsp;<span class="text-lg">{{ person.firstname }} {{ person.lastname }}</span>
        </div>
      </li>
      <li class="px-3 py-2">42</li>
    </ul>
  </div>
  <PersonCreate class="rounded bg-gray-100 mt-3" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PersonCreate from '../components/PersonCreate.vue'
import { attendanceStore } from '@/store/attendance'

export default defineComponent({
  props: ['id'],
  components: { PersonCreate },
  setup(props) {
    return {
      props,
      persons: attendanceStore.sortedPersons,
    }
  },
})
</script>
