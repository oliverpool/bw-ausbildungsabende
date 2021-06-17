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
            <PersonTrainingCheckbox
              :is-checked="isChecked(person.id)"
              :training-id="id"
              :person="person"
            />{{ person.type }}
          </label>
          &nbsp;<span class="text-lg">{{ person.firstname }} {{ person.lastname }}</span>
        </div>
      </li>
      <li class="px-3 py-2">
        {{ personTraining.length }}
        <small class="text-gray-700">/ {{ persons.length }}</small>
      </li>
    </ul>
  </div>
  <PersonCreate class="rounded bg-gray-100 mt-3" :training-id="id" />
</template>
<script lang="ts">
import { defineComponent, toRef } from 'vue'
import PersonCreate from '../components/PersonCreate.vue'
import PersonTrainingCheckbox from '../components/PersonTrainingCheckbox.vue'
import { attendanceStore } from '@/store/attendance'

export default defineComponent({
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: { PersonCreate, PersonTrainingCheckbox },
  setup(props) {
    const personTraining = attendanceStore.getPersonTrainingByTraining(toRef(props, 'id'))
    return {
      personTraining,
      persons: attendanceStore.sortedPersons,
      isChecked(id: number) {
        return !!personTraining.value.find((pt) => pt.person_id === id)
      },
    }
  },
})
</script>
