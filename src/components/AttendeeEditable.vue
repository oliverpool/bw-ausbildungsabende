<template>
  <div v-if="!form.isOpen" class="text-lg">
    {{ attendee.firstname }}
    <span class="text-gray-700">{{ attendee.lastname }}</span>
    <small class="text-gray-700" v-if="oldType && oldType !== attendee.type">
      (mittlerweile {{ attendee.type }})
    </small>
  </div>
  <button
    v-if="!form.isOpen"
    @click="open"
    class="flex-auto text-right self-start text-gray-300 pr-2 hover:text-blue-700"
  >
    <svg
      class="w-6 h-6 inline-block"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      ></path>
    </svg>
  </button>

  <form v-if="form.isOpen" @submit.prevent="submit" class="bg-gray-200 rounded px-3">
    <label class="block">
      <small class="text-gray-700">Vorname</small>
      <input class="block w-64" type="text" v-model.trim="form.firstname" required />
    </label>
    <label>
      <small class="text-gray-700">Nachname</small>
      <input class="block w-64" type="text" v-model.trim="form.lastname" required />
    </label>
    <label>
      <small class="text-gray-700">{{ $branding.type }}</small>
      <select class="block w-64" v-model="form.type">
        <option v-for="(type, short) in $branding.types" :key="short" :value="short">
          {{ short }} - {{ type }}
        </option>
      </select>
    </label>
    <div class="py-3 flex justify-between items-center">
      <button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full">
        Speichern
      </button>
      <button
        @click="form.isOpen = false"
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm"
      >
        Abbrechen
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

import { attendanceStore, AttendeeEntity } from '@/store/automerge'
import { TableRow } from 'automerge'

export default defineComponent({
  props: {
    oldType: {
      type: String,
      default: null,
    },
    attendee: {
      type: Object as () => AttendeeEntity & TableRow,
      required: true,
    },
  },
  setup(props) {
    const form = reactive({
      firstname: props.attendee.firstname,
      lastname: props.attendee.lastname,
      type: props.attendee.type,
      isOpen: false,
    })
    return {
      form,
      submit() {
        attendanceStore.updateAttendee(props.attendee.id, form)
        form.isOpen = false
      },
      open() {
        form.firstname = props.attendee.firstname
        form.lastname = props.attendee.lastname
        form.type = props.attendee.type
        form.isOpen = true
      },
    }
  },
})
</script>
