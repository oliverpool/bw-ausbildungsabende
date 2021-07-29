import { computed, ComputedRef, Ref } from '@vue/runtime-core'
import {
  FreezeObject,
  change as automergeChange,
  init as automergeInit,
  save as automergeSave,
  load as automergeLoad,
  merge as automergeMerge,
  Table,
  TableRow,
  BinaryDocument,
} from 'automerge'
import { readonly, ref } from 'vue'
import { get as idbGet, set as idbSet } from 'idb-keyval'

export interface Attendance {
  trainings: Table<TrainingEntity>
  persons: Table<PersonEntity>
  person_trainings: Table<PersonTrainingEntity>
}
export interface TrainingEntity {
  topic: string
  date: string
}
export interface PersonEntity {
  firstname: string
  lastname: string
  type: string
}
export interface PersonTrainingEntity {
  person_id: string
  training_id: string
  type: string
}

const emptyDoc: Uint8Array = new Uint8Array([
  133, 111, 74, 131, 183, 247, 151, 109, 0, 149, 1, 1, 16, 141, 128, 139, 194, 43, 181, 64, 157,
  154, 92, 3, 37, 128, 182, 81, 40, 1, 99, 210, 110, 94, 159, 127, 17, 163, 224, 167, 97, 242, 217,
  140, 99, 56, 210, 42, 96, 145, 37, 92, 184, 136, 80, 218, 67, 86, 187, 165, 8, 80, 7, 1, 2, 3, 2,
  19, 2, 35, 6, 53, 2, 64, 2, 86, 2, 7, 21, 36, 33, 2, 35, 4, 52, 1, 66, 2, 86, 2, 128, 1, 2, 127,
  0, 127, 1, 127, 3, 127, 167, 144, 129, 136, 6, 127, 0, 127, 0, 127, 7, 125, 16, 112, 101, 114,
  115, 111, 110, 95, 116, 114, 97, 105, 110, 105, 110, 103, 115, 7, 112, 101, 114, 115, 111, 110,
  115, 9, 116, 114, 97, 105, 110, 105, 110, 103, 115, 3, 0, 127, 3, 2, 127, 3, 3, 6, 3, 0, 3, 0,
])

class AttendanceStore {
  private $doc: FreezeObject<Attendance>
  private $version = ref(1)
  private $saveErr = ref(null)
  private $savedVersion = ref(0)
  private $savedSize = ref(0)

  constructor() {
    this.$doc = automergeLoad<Attendance>(emptyDoc as BinaryDocument)

    idbGet('automerge')
      .then((data) => {
        if (!data) {
          return
        }
        this.importAndMerge(data)
      })
      .catch((err) => {
        this.$saveErr.value = err
      })
  }
  clean() {
    this.$doc = automergeLoad<Attendance>(emptyDoc as BinaryDocument)
    this.$version.value++
    this.saveNow()
  }

  private $timeout: number | undefined
  private async saveLater() {
    clearTimeout(this.$timeout)
    this.$timeout = setTimeout(() => this.saveNow(), 3000)
  }
  private async saveNow() {
    try {
      this.$saveErr.value = null
      const version = this.$version.value
      const data = this.export()
      await idbSet('automerge', data)
      this.$savedVersion.value = version
      this.$savedSize.value = data.byteLength
      console.log('saved')
    } catch (err) {
      this.$saveErr.value = err
    }
  }

  private update<T>(cb: (doc: Attendance) => T): T {
    let v: T | undefined
    this.$doc = automergeChange(this.$doc, (doc) => {
      v = cb(doc)
    })
    this.$version.value++
    this.saveLater()
    return v as T
  }
  export(): Uint8Array {
    return automergeSave(this.$doc)
  }
  importAndMerge(data: Uint8Array) {
    const imported = automergeLoad<Attendance>(data as BinaryDocument)
    if (this.$doc.trainings.count == 0 && this.$doc.persons.count == 0) {
      this.$doc = imported
    } else {
      this.$doc = automergeMerge(this.$doc, imported)
    }
    this.$version.value++
    this.saveNow()
  }
  createTraining(training: TrainingEntity): string {
    const id = this.update((doc) => {
      return doc.trainings.add(training)
    })
    return id
  }
  get latestTrainings(): ComputedRef<(TrainingEntity & TableRow)[]> {
    return computed(
      () => (this.$version.value as any) && this.$doc.trainings.rows.slice(0).reverse()
    )
  }
  getTraining(id: string): (TrainingEntity & TableRow) | undefined {
    return (this.$version.value as any) && this.$doc.trainings.byId(id)
  }
  createPerson(person: PersonEntity): string {
    const id = this.update((doc) => {
      return doc.persons.add(person)
    })
    return id
  }
  get sortedPersons(): ComputedRef<(PersonEntity & TableRow)[]> {
    return computed(
      () =>
        (this.$version.value as any) &&
        this.$doc.persons.rows.sort((a, b) => {
          const firstnameCmp = a.firstname.localeCompare(b.firstname, 'de-de')
          if (firstnameCmp != 0) {
            return firstnameCmp
          }
          return a.lastname.localeCompare(b.lastname, 'de-de')
        })
    )
  }
  getPersonTrainingByTraining(id: Ref<string>): ComputedRef<(PersonTrainingEntity & TableRow)[]> {
    return computed(
      () =>
        (this.$version.value as any) &&
        this.$doc.person_trainings.filter((pt) => pt.training_id == id.value)
    )
  }
  createPersonTraining(person_id: string, person_type: string, training_id: string) {
    this.update((doc) => {
      doc.person_trainings.add({
        person_id: person_id,
        type: person_type,
        training_id,
      })
    })
  }
  deletePersonTraining(person_id: string, training_id: string) {
    const ids = this.$doc.person_trainings.rows
      .filter((pt) => pt.person_id == person_id && pt.training_id == training_id)
      .map((pt) => pt.id)
    this.update((doc) => {
      ids.forEach((id: string) => {
        doc.person_trainings.remove(id)
      })
    })
  }
  get savedVersion(): Ref<number> {
    return readonly(this.$savedVersion)
  }
  get savedSize(): Ref<number> {
    return readonly(this.$savedSize)
  }
  get currentVersion(): Ref<number> {
    return readonly(this.$version)
  }
  get saveErr(): Ref<any> {
    return readonly(this.$saveErr)
  }
}

export const attendanceStore = new AttendanceStore()
