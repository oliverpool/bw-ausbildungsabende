import { computed, ComputedRef, Ref } from '@vue/runtime-core'
import { Store } from './main'

export interface Attendance {
  trainings: TrainingEntity[]
  attendees: AttendeeEntity[]
  attendee_trainings: AttendeeTrainingEntity[]
}
export interface TrainingEntity {
  id: number
  topic: string
  date: string
}
export interface AttendeeEntity {
  id: number
  firstname: string
  lastname: string
  type: string
}
export interface AttendeeTrainingEntity {
  attendee_id: number
  training_id: number
  type: string
}

class AttendanceStore extends Store<Attendance> {
  private saveAll() {
    this.saveTrainings()
    this.saveAttendees()
    this.saveAttendeeTrainings()
  }
  private saveTrainings() {
    saveArray('trainings', this.$state.trainings)
  }
  private saveAttendees() {
    saveArray('attendees', this.$state.attendees)
  }
  private saveAttendeeTrainings() {
    saveArray('attendee_trainings', this.$state.attendee_trainings)
  }
  exportString() {
    return JSON.stringify(this.$state)
  }
  importObject(state: Attendance) {
    Object.assign(this.$state, state)
    this.saveAll()
  }
  createTraining(training: TrainingEntity): TrainingEntity {
    training.id = this.$state.trainings.length + 1
    this.$state.trainings.push(training)
    this.saveTrainings()
    return training
  }
  get counts(): ComputedRef<{ [key: string]: number }> {
    return computed(() => {
      return {
        trainings: this.$state.trainings.length,
        attendees: this.$state.attendees.length,
      }
    })
  }
  get latestTrainings(): ComputedRef<TrainingEntity[]> {
    return computed(() => this.$state.trainings.slice(0).reverse())
  }
  getTraining(id: number): TrainingEntity | undefined {
    return this.$state.trainings.find((t) => t.id == id)
  }
  createAttendee(attendee: AttendeeEntity): AttendeeEntity {
    attendee.id = this.$state.attendees.length + 1
    this.$state.attendees.push(attendee)
    this.saveAttendees()
    return attendee
  }
  get sortedAttendees(): ComputedRef<AttendeeEntity[]> {
    return computed(() =>
      [...this.$state.attendees].sort((a, b) => {
        const firstname = a.firstname.localeCompare(b.firstname, 'de-de')
        if (firstname != 0) {
          return firstname
        }
        return a.lastname.localeCompare(b.lastname, 'de-de')
      })
    )
  }
  getAttendeeTrainingByTraining(id: Ref<number>): ComputedRef<AttendeeTrainingEntity[]> {
    return computed(() => this.$state.attendee_trainings.filter((pt) => pt.training_id == id.value))
  }
  createAttendeeTraining(attendee: AttendeeEntity, training_id: number) {
    this.$state.attendee_trainings.push({
      attendee_id: attendee.id,
      type: attendee.type,
      training_id,
    })
    this.saveAttendeeTrainings()
  }
  deleteAttendeeTraining(attendee_id: number, training_id: number) {
    this.$state.attendee_trainings = this.$state.attendee_trainings.filter(
      (pt) => pt.attendee_id != attendee_id || pt.training_id != training_id
    )
    this.saveAttendeeTrainings()
  }
}
function saveArray(key: string, value: Array<any>) {
  window.localStorage.setItem('attendance-' + key, JSON.stringify(value))
}
function loadArray(key: string) {
  const saved = window.localStorage.getItem('attendance-' + key)
  if (!saved) {
    return []
  }
  return JSON.parse(saved)
}

function initialAttendance(): Attendance {
  return {
    trainings: loadArray('trainings'),
    attendees: loadArray('attendees'),
    attendee_trainings: loadArray('attendee_trainings'),
  }
}

export const attendanceStore = new AttendanceStore(initialAttendance())
