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
  attendees: Table<AttendeeEntity>
  attendee_trainings: Table<AttendeeTrainingEntity>
}
export interface TrainingEntity {
  topic: string
  date: string
}
export interface AttendeeEntity {
  firstname: string
  lastname: string
  type: string
}
export interface AttendeeTrainingEntity {
  attendee_id: string
  training_id: string
  type: string
}

const emptyDoc: Uint8Array = new Uint8Array([
  133, 111, 74, 131, 171, 234, 108, 91, 0, 153, 1, 1, 16, 225, 50, 44, 228, 223, 60, 73, 58, 191,
  131, 243, 152, 164, 22, 144, 137, 1, 137, 89, 131, 238, 104, 128, 161, 183, 192, 209, 198, 181,
  21, 63, 7, 175, 176, 88, 105, 222, 106, 39, 228, 113, 62, 88, 33, 116, 208, 132, 134, 184, 7, 1,
  2, 3, 2, 19, 2, 35, 6, 53, 2, 64, 2, 86, 2, 7, 21, 40, 33, 2, 35, 4, 52, 1, 66, 2, 86, 2, 128, 1,
  2, 127, 0, 127, 1, 127, 3, 127, 168, 249, 138, 136, 6, 127, 0, 127, 0, 127, 7, 125, 18, 97, 116,
  116, 101, 110, 100, 101, 101, 95, 116, 114, 97, 105, 110, 105, 110, 103, 115, 9, 97, 116, 116,
  101, 110, 100, 101, 101, 115, 9, 116, 114, 97, 105, 110, 105, 110, 103, 115, 3, 0, 127, 3, 2, 127,
  3, 3, 6, 3, 0, 3, 0,
])

class AttendanceStore {
  private $doc: FreezeObject<Attendance>
  private $version = ref(1)
  private $saveErr = ref(null)
  private $savedVersion = ref(0)
  private $savedSize = ref(0)

  constructor() {
    this.$doc = automergeLoad<Attendance>(emptyDoc as BinaryDocument)
    // this.$doc = automergeChange(automergeInit<Attendance>(), (doc) => {
    //   doc.trainings = new Table()
    //   doc.attendees = new Table()
    //   doc.attendee_trainings = new Table()
    // })
    // console.log(this.export().toString())

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
    this.$timeout = setTimeout(() => this.saveNow(), 1000)
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
    if (!imported.trainings || !imported.attendees) {
      return
    }
    if (this.$doc.trainings.count == 0 && this.$doc.attendees.count == 0) {
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
  createAttendee(attendee: AttendeeEntity): string {
    const id = this.update((doc) => {
      return doc.attendees.add(attendee)
    })
    return id
  }
  get sortedAttendees(): ComputedRef<(AttendeeEntity & TableRow)[]> {
    return computed(
      () =>
        (this.$version.value as any) &&
        this.$doc.attendees.rows.sort((a, b) => {
          const firstnameCmp = a.firstname.localeCompare(b.firstname, 'de-de')
          if (firstnameCmp != 0) {
            return firstnameCmp
          }
          return a.lastname.localeCompare(b.lastname, 'de-de')
        })
    )
  }
  findAttendee(firstname: string, lastname: string): (AttendeeEntity & TableRow) | undefined {
    const f = firstname.toLowerCase()
    const l = lastname.toLowerCase()
    return this.$doc.attendees.rows.find(
      (p) => p.firstname.toLowerCase() === f && p.lastname.toLowerCase() === l
    )
  }
  importAttendees(insert: AttendeeEntity[], update: (AttendeeEntity & TableRow)[]) {
    this.update((doc) => {
      insert.forEach((i) => {
        doc.attendees.add(i)
      })
      update.forEach((u) => {
        const a = doc.attendees.byId(u.id)
        a.firstname = u.firstname
        a.lastname = u.lastname
        a.type = u.type
      })
    })
  }
  updateAttendee(id: string, attendee: AttendeeEntity) {
    this.update((doc) => {
      const a = doc.attendees.byId(id)
      a.firstname = attendee.firstname
      a.lastname = attendee.lastname
      a.type = attendee.type
    })
  }
  getAttendeeTrainingByTraining(
    id: Ref<string>
  ): ComputedRef<(AttendeeTrainingEntity & TableRow)[]> {
    return computed(
      () =>
        (this.$version.value as any) &&
        this.$doc.attendee_trainings.filter((pt) => pt.training_id == id.value)
    )
  }
  createAttendeeTraining(attendee_id: string, attendee_type: string, training_id: string) {
    this.update((doc) => {
      doc.attendee_trainings.add({
        attendee_id: attendee_id,
        type: attendee_type,
        training_id,
      })
    })
  }
  deleteAttendeeTraining(attendee_id: string, training_id: string) {
    const ids = this.$doc.attendee_trainings.rows
      .filter((pt) => pt.attendee_id == attendee_id && pt.training_id == training_id)
      .map((pt) => pt.id)
    this.update((doc) => {
      ids.forEach((id: string) => {
        doc.attendee_trainings.remove(id)
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
