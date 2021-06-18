<template>
  <details ref="details">
    <summary class="text-gray-500">Backup-Datei erstellen/importieren</summary>
    <label class="block mt-3">
      <h3 class="text-sm pb-1">Backup-Datei importieren:</h3>
      <input type="file" class="block w-full" accept="application/json" @change="promptImport" />
    </label>
    <p v-if="importErr" v-text="importErr" class="text-red-600 font-bold" />
    <div v-if="importable">
      <p class="py-2 font-bold">
        Willst du wirklich diese Backup-Datei importieren? ({{
          importable.trainings.length
        }}
        Abende, {{ importable.persons.length }} Einsatzkräfte)
      </p>
      <p class="text-red-600">
        Alle Ausbildungsabende und Einsatzkräfte werden von der aktuelle Session gelöscht! ({{
          currentCounts.trainings
        }}
        Abende, {{ currentCounts.persons }} Einsatzkräfte)
      </p>
      <button
        @click="importBackup"
        class="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-full"
      >
        Backup-Datei importieren
      </button>
    </div>
    <label class="block mt-6">
      <h3 class="text-sm pb-1">Backup-Datei erstellen:</h3>
      <button
        @click="saveBackup"
        class="bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded px-2"
      >
        Backup-Datei speichern unter&hellip;
      </button>
    </label>
  </details>
</template>
<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'

import { Attendance, attendanceStore } from '@/store/attendance'

// adapted from https://stackoverflow.com/a/34156339/3207406
function downloadFile(content: string, fileName: string, contentType: string) {
  var a = document.createElement('a')
  var file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export default defineComponent({
  setup() {
    const importable: Ref<Attendance | null> = ref(null)
    const importErr: Ref<string | null> = ref(null)
    const details = ref(null) //from the DOM
    return {
      details,
      importable,
      importErr,
      currentCounts: attendanceStore.counts,
      saveBackup() {
        const txt = attendanceStore.exportString()
        const filename = 'Ausbildungsabende-' + new Date().toISOString().substr(0, 10) + '.json'
        downloadFile(txt, filename, 'application/json')
      },
      importBackup() {
        if (!importable.value) {
          return
        }
        attendanceStore.importObject(importable.value)
        importable.value = null
        details.value.removeAttribute('open')
      },
      promptImport(e) {
        importable.value = null
        importErr.value = null

        const file = e.target && e.target.files && e.target.files.length && e.target.files[0]
        if (!file) {
          return
        }
        var reader = new FileReader()
        reader.onload = function () {
          e.target.value = ''
          let parsed
          try {
            parsed = JSON.parse(reader.result)
          } catch (error) {
            importErr.value = error
            return
          }
          const missing = []
          for (const m of ['trainings', 'persons', 'person_trainings']) {
            if (!parsed[m]) {
              missing.push(m)
            }
          }
          if (missing.length) {
            importErr.value = 'Wichtige Felder fehlen von der Backup-Datei: ' + missing.join(', ')
            return
          }
          importable.value = parsed
        }
        reader.readAsText(file)
      },
    }
  },
})
</script>
