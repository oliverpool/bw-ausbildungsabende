<template>
  <form @submit.prevent="submit" class="px-3 pb-2" :class="{ 'bg-red-100': isDuplicated }">
    <label class="block pb-4">
      <small :class="isExpanded ? 'text-gray-700' : 'invisible'">Vorname</small>
      <input
        class="block w-64"
        :class="isExpanded ? '' : 'border-transparent bg-gray-100 font-bold placeholder-blue-700'"
        type="text"
        v-model.trim="values.firstname"
        required
        :placeholder="isExpanded ? '' : 'Neue Einsatzkraft'"
        @focus="hasFocus = 1"
        @blur="blurred"
      />
    </label>
    <div v-show="isExpanded">
      <label>
        <small class="text-gray-700">Nachname</small>
        <input class="block w-64" type="text" v-model.trim="values.lastname" required />
      </label>
      <label>
        <small class="text-gray-700">Ausbildung</small>
        <select class="block w-64" v-model="values.type">
          <option v-for="(type, short) in types" :key="short" :value="short">
            {{ short }} - {{ type }}
          </option>
        </select>
      </label>
      <label v-show="trainingId" class="flex items-center">
        <input type="checkbox" v-model="values.present" />
        <span class="text-gray-700 p-2">Anwesend an diesem Ausbildungsabend</span>
      </label>
      <div v-if="isDuplicated" class="pb-3 font-bold text-red-600">
        Diese Einsatzkraft wurde schon eingetragen!
      </div>
      <div v-else class="pb-3">
        <button
          type="submit"
          class="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full"
        >
          Einsatzkraft speichern
        </button>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { attendanceStore } from '@/store/attendance'

export default defineComponent({
  props: {
    trainingId: {
      type: Number,
    },
  },
  setup(props) {
    const values = reactive({
      firstname: '',
      lastname: '',
      type: 'AW',
      present: !!props.trainingId,
    })

    const persons = attendanceStore.sortedPersons
    const isDuplicated = computed(
      () =>
        !!persons.value.find(
          (p) => p.firstname === values.firstname && p.lastname === values.lastname
        )
    )

    const hasFocus = ref(0)
    return {
      types: {
        AW: 'Anwärter',
        AEK: 'Atkive Einsatzkraft',
        JG: 'Jugendgruppe',
        KB: 'Keine Bereitschaftdienst',
      },
      values,
      blurred() {
        const now = Date.now()
        hasFocus.value = now
        setTimeout(() => {
          if (hasFocus.value !== now) {
            return
          }
          hasFocus.value = 0
        }, 200)
      },
      hasFocus,
      isExpanded: computed(() => values.firstname || hasFocus.value > 0),
      submit() {
        const v = {
          firstname: values.firstname,
          lastname: values.lastname,
          type: values.type,
          id: 0,
        }
        const created = attendanceStore.createPerson(v)
        if (values.present && props.trainingId) {
          attendanceStore.createPersonTraining(created, props.trainingId)
        }
        values.firstname = ''
        values.lastname = ''
        values.type = 'AW'
      },
      isDuplicated,
    }
  },
})
</script>
