<template>
  <div class="px-8 prose">
    <h1>{{ msg }}</h1>
    <button class="px-3 py-2 border border-gray-300 rounded-md shadow" @click="increment">
      count is: {{ state.count }}
    </button>
    <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { clickStore as store } from '@/store/training'

export default defineComponent({
  props: ['msg'],
  setup() {
    return {
      increment: () => store.incrementCount(),
      state: store.state,
    }
  },
})
</script>
