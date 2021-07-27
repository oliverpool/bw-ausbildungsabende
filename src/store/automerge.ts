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

class AttendanceStore {
  private $doc: FreezeObject<Attendance>
  private $version = ref(1)
  private $saveErr = ref(null)
  private $savedVersion = ref(0)
  private $savedSize = ref(0)

  constructor() {
    this.$doc = automergeChange(automergeInit<Attendance>(), (doc) => {
      doc.trainings = new Table()
      doc.persons = new Table()
      doc.person_trainings = new Table()
    })

    idbGet('automerge')
      .then((data) => {
        this.importAndMerge(data)
      })
      .catch((err) => {
        this.$saveErr.value = err
      })
  }

  private async save() {
    try {
      this.$saveErr.value = null
      const version = this.$version.value
      const data = this.export()
      await idbSet('automerge', data)
      this.$savedVersion.value = version
      this.$savedSize.value = data.byteLength
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
    this.save()
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
    this.save()
  }
  createTraining(training: TrainingEntity): string {
    const id = this.update((doc) => {
      return doc.trainings.add(training)
    })
    return id
  }
  get counts(): ComputedRef<{ [key: string]: number }> {
    return computed(() => {
      return (
        (this.$version.value as any) && {
          trainings: this.$doc.trainings.count,
          persons: this.$doc.persons.count,
        }
      )
    })
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
