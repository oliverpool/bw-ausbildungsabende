<template>
  <form @submit.prevent="submit">
    <label class="block pb-4">
      <textarea required class="block w-full" rows="10" v-model.trim="values.csv" />
    </label>
    <div class="pb-3">
      <details v-if="partitionedLines.new.length" class="my-2">
        <summary class="text-gray-700">Neue: {{ partitionedLines.new.length }}</summary>
        <ul>
          <li v-for="a in partitionedLines.new" :key="a.id">
            <span class="text-gray-700">{{ a.type }}</span>
            <span class="inline-block text-lg px-2">{{ a.firstname }}</span>
            <span class="text-gray-700 text-lg">{{ a.lastname }}</span>
          </li>
        </ul>
      </details>
      <details v-if="partitionedLines.updated.length" class="my-2">
        <summary class="text-gray-700">Geändert: {{ partitionedLines.updated.length }}</summary>
        <ul>
          <li v-for="a in partitionedLines.updated" :key="a.id">
            <span class="text-blue-700 font-bold">{{ a.type }}</span>
            <span class="inline-block text-lg px-2">{{ a.firstname }}</span>
            <span class="text-gray-700 text-lg">{{ a.lastname }}</span>
          </li>
        </ul>
      </details>
      <details v-if="partitionedLines.inchanged.length" class="my-2">
        <summary class="text-gray-700">
          Unverändert: {{ partitionedLines.inchanged.length }}
        </summary>
        <ul>
          <li v-for="a in partitionedLines.inchanged" :key="a.id">
            <span class="text-gray-700">{{ a.type }}</span>
            <span class="inline-block text-lg px-2">{{ a.firstname }}</span>
            <span class="text-gray-700 text-lg">{{ a.lastname }}</span>
          </li>
        </ul>
      </details>
      <button
        type="submit"
        class="mt-4 py-2 px-4 rounded-full"
        :class="{
          'bg-blue-700 hover:bg-blue-800 text-white': importable,
          'bg-gray-200': !importable,
        }"
      >
        Einsatzkräfte importieren
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { attendanceStore, AttendeeEntity } from '@/store/automerge'
import { TableRow, uuid } from 'automerge'

export default defineComponent({
  emits: ['imported'],
  setup(props, { emit }) {
    const values = reactive({
      csv: '',
      lineSeparator: '\n',
      cellSeparator: '\t',
      indexFirstname: 0,
      indexLastname: 1,
      indexType: 2,
    })
    const lines = computed(() => {
      return values.csv
        .split(values.lineSeparator)
        .map((l) =>
          l
            .trim()
            .split(values.cellSeparator)
            .map((c) => c.trim())
            .filter((c) => c)
        )
        .filter((l) => l.length >= 3)
        .map((l) => {
          return {
            firstname: l[values.indexFirstname],
            lastname: l[values.indexLastname],
            type: l[values.indexType],
            id: uuid(),
          } as AttendeeEntity & TableRow
        })
    })

    const partitionedLines = computed(() => {
      return lines.value.reduce(
        (acc, current) => {
          const existing = attendanceStore.findAttendee(current.firstname, current.lastname)
          if (!existing) {
            acc.new.push(current)
            return acc
          }
          const updated = {
            ...current,
            id: existing.id,
          }
          if (existing.type === updated.type) {
            acc.inchanged.push(updated)
            return acc
          }
          acc.updated.push(updated)
          return acc
        },
        {
          new: [] as (AttendeeEntity & TableRow)[],
          inchanged: [] as (AttendeeEntity & TableRow)[],
          updated: [] as (AttendeeEntity & TableRow)[],
        }
      )
    })

    const importable = computed(
      () => partitionedLines.value.new.length || partitionedLines.value.updated.length
    )

    return {
      types: {
        AW: 'Anwärter',
        AEK: 'Atkive Einsatzkraft',
        JG: 'Jugendgruppe',
        KB: 'Keine Bereitschaftdienst',
      },
      values,
      lines,
      partitionedLines,
      importable,
      submit() {
        if (!importable.value) {
          alert('Nichts zu importieren')
          return
        }
        attendanceStore.importAttendees(partitionedLines.value.new, partitionedLines.value.updated)
        values.csv = ''
        emit('imported')
      },
    }
  },
})
</script>
