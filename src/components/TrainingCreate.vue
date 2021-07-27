<template>
  <form @submit.prevent="submit" class="px-3 pb-2">
    <label class="block pb-4">
      <small :class="isExpanded ? 'text-gray-700' : 'invisible'">Thema</small>
      <input
        class="block w-64"
        :class="isExpanded ? '' : 'border-transparent bg-gray-100 font-bold placeholder-blue-700'"
        type="text"
        v-model.trim="values.topic"
        required
        :placeholder="isExpanded ? '' : 'Neuer Ausbildungsabend'"
        @focus="hasFocus = 1"
        @blur="blurred"
      />
    </label>
    <label v-show="isExpanded">
      <small class="text-gray-700">Datum</small>
      <input
        class="block w-64"
        type="date"
        v-model.trim="values.date"
        placeholder="JJJJ-MM-TT"
        required
        :disabled="!values.topic"
      />
    </label>
    <div v-show="isExpanded" class="pb-3">
      <button
        type="submit"
        class="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full"
      >
        Ausbildungsabend erstellen →
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { attendanceStore } from '@/store/automerge'
import router from '@/router'

export default defineComponent({
  setup() {
    const values = reactive({
      topic: '',
      date: new Date().toISOString().substr(0, 10),
    })

    const hasFocus = ref(0)
    return {
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
      isExpanded: computed(() => values.topic || hasFocus.value > 0),
      submit() {
        const v = { ...values, id: 0 }
        const trainingId = attendanceStore.createTraining(v)
        values.topic = ''
        values.date = new Date().toISOString().substr(0, 10)
        router.push({ name: 'training.attendance', params: { id: trainingId } })
      },
    }
  },
})
</script>
