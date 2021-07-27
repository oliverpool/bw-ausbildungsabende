<template>
  <details ref="details">
    <summary class="text-gray-500">
      <span class="inline-block mr-4">Backup-Datei erstellen/importieren</span>
      <span v-if="imported" class="inline-block- font-bold text-green-700"
        >Erfolgreich importiert!</span
      >
    </summary>
    <label class="block mt-3">
      <h3 class="text-sm pb-1">Backup-Datei importieren:</h3>
      <input type="file" class="block w-full" accept=".automerge" @change="promptImport" />
    </label>
    <p v-if="importErr" v-text="importErr" class="text-red-600 font-bold" />
    <label class="block mt-6">
      <h3 class="text-sm pb-1">Backup-Datei erstellen:</h3>
      <button
        @click="saveBackup"
        class="bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded px-2"
      >
        Backup-Datei speichern unter&hellip;
      </button>
    </label>
    <div class="block mt-6 text-right">
      <button class="text-sm pb-1 hover:underline text-gray-500" @click="promptClean">
        Datei löschen&hellip;
      </button>
    </div>
  </details>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'

import { attendanceStore } from '@/store/automerge'

// adapted from https://stackoverflow.com/a/34156339/3207406
function downloadFile(content: Uint8Array, fileName: string, contentType: string) {
  var a = document.createElement('a')
  var file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export default defineComponent({
  setup() {
    const imported: Ref<boolean> = ref(false)
    const importErr: Ref<string | null> = ref(null)
    const details: Ref<HTMLDetailsElement | null> = ref(null) //from the DOM

    const closeDetails = () => {
      if (details.value) {
        details.value.removeAttribute('open')
      }
    }
    return {
      details,
      imported,
      importErr,
      currentCounts: attendanceStore.counts,
      saveBackup() {
        const txt = attendanceStore.export()
        const filename =
          'Ausbildungsabende-' + new Date().toISOString().substr(0, 10) + '.automerge'
        downloadFile(txt, filename, 'application/octet-stream')
      },
      promptImport(e: Event) {
        imported.value = false
        importErr.value = null
        const target = e.target as HTMLInputElement
        const file = target && target.files && target.files.length && target.files[0]
        if (!file) {
          return
        }
        var reader = new FileReader()
        reader.onload = function () {
          target.value = ''
          try {
            attendanceStore.importAndMerge(new Uint8Array(reader.result as ArrayBuffer))
            imported.value = true
            closeDetails()
          } catch (error) {
            importErr.value = error
          }
        }
        reader.readAsArrayBuffer(file)
      },
      promptClean() {
        if (!confirm('Alle Daten unwiderruflich löschen?')) {
          return
        }
        attendanceStore.clean()
        closeDetails()
      },
    }
  },
})
</script>
