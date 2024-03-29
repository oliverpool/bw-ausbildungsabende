<template>
  <div class="overflow-auto">
    <table>
      <tbody>
        <tr>
          <td></td>
          <td
            v-for="(training, i) in allTrainings"
            :key="training.id"
            class="p-1 text-lg text-center leading-none"
            :class="{
              'bg-gray-100': i % 2 == 0,
            }"
          >
            <router-link
              :to="{ name: 'training.show', params: { id: training.id } }"
              class="hover:underline"
            >
              {{ training.topic }}<br />
              <small class="text-gray-700">{{ training.date }}</small
              ><br />
              <small>{{ attendanceCount(training.id) }}</small>
            </router-link>
          </td>
        </tr>
        <template v-for="(type, short) in types" :key="short">
          <tr>
            <td class="p-3 pb-0 text-xl" :colspan="allTrainings.length + 1">
              {{ attendeesByType[short].value.length }} {{ short }}
              <small class="text-gray-700">{{ type }}</small>
            </td>
          </tr>

          <tr
            v-for="(attendee, i) in attendeesByType[short].value"
            :key="attendee.id"
            :class="{
              'border-gray-400': i % 2 == 1,
            }"
            class="border-b border-t"
          >
            <td class="py-2 pl-2 sticky left-0 bg-gray-50">
              <div class="flex"><AttendeeEditable :attendee="attendee" /></div>
            </td>

            <td
              v-for="(training, i) in allTrainings"
              :key="training.id"
              class="text-center"
              :class="{
                'bg-gray-100': i % 2 == 0,
              }"
            >
              {{ attendeePresence(training.id, attendee.id) }}
            </td>
          </tr>
        </template>
        <template v-if="!attendeesByType['×'].value.length"></template>
        <template v-else-if="!showFormer">
          <tr>
            <td class="p-3 pb-0 text-xl" :colspan="allTrainings.length + 1">
              {{ attendeesByType['×'].value.length }} {{ '×' }}
              <small class="text-gray-700">{{ $branding.types['×'] }}</small>
            </td>
          </tr>
          <tr>
            <td
              class="px-3 py-1 bg-gray-50 text-gray-600 cursor-pointer"
              :colspan="allTrainings.length + 1"
              @click="showFormer = true"
            >
              ▶&nbsp;&nbsp;Anzeigen
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td
              class="px-3 py-1 bg-gray-50 text-gray-600 cursor-pointer"
              :colspan="allTrainings.length + 1"
              @click="showFormer = false"
            >
              ▲&nbsp;&nbsp;Verbergen
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <div class="py-4">
    <router-link to="/" class="text-blue-600 py-4 pr-2 hover:underline">← Zurück</router-link>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from 'vue'

import { attendanceStore, AttendeeEntity } from '@/store/automerge'
import AttendeeEditable from '@/components/AttendeeEditable.vue'

import branding from '@branding'
import { TableRow } from 'automerge'

export default defineComponent({
  components: {
    AttendeeEditable,
  },
  setup() {
    const attendeesByType: { [key: string]: ComputedRef<(AttendeeEntity & TableRow)[]> } = {}
    const types = branding.types

    for (const t of Object.keys(types)) {
      attendeesByType[t] = attendanceStore.getSortedAttendees((a) => a.type == t)
    }

    const showFormer = ref(false)
    const activeTypes = computed(() => {
      const t = { ...types }
      if (!showFormer.value) {
        delete t['×']
      }
      return t
    })

    return {
      showFormer,
      types: activeTypes,
      attendeesByType,
      allTrainings: attendanceStore.allTrainings,
      attendanceCount: (training_id: string) =>
        attendanceStore.getAttendeeTrainingByTraining(ref(training_id)).value.length,

      attendeePresence: (training_id: string, attendee_id: string) =>
        attendanceStore.getAttendeeTrainingByTraining(ref(training_id)).value.find((a) => {
          return a.attendee_id == attendee_id
        })?.type,
    }
  },
})
</script>
