import { computed, ComputedRef } from '@vue/runtime-core'
import { Store } from './main'

export interface Attendance {
  trainings: TrainingEntity[]
  persons: PersonEntity[]
  person_trainings: PersonTrainingEntity[]
}
export interface TrainingEntity {
  id: number
  topic: string
  date: string
}
export interface PersonEntity {
  id: number
  firstname: string
  lastname: string
  type: string
}
export interface PersonTrainingEntity {
  person_id: number
  training_id: number
  type: string
}

class AttendanceStore extends Store<Attendance> {
  private save() {
    const serial = JSON.stringify(this.$state)
    window.localStorage.setItem('attendance', serial)
  }
  createTraining(training: TrainingEntity): TrainingEntity {
    training.id = this.$state.trainings.length + 1
    this.$state.trainings.push(training)
    this.save()
    return training
  }
  get latestTrainings(): ComputedRef<TrainingEntity[]> {
    return computed(() => this.$state.trainings.slice(0).reverse())
  }
  getTraining(id: number): TrainingEntity | undefined {
    return this.$state.trainings.find((t) => t.id == id)
  }
  createPerson(person: PersonEntity): PersonEntity {
    person.id = this.$state.persons.length + 1
    this.$state.persons.push(person)
    this.save()
    return person
  }
  get sortedPersons(): ComputedRef<PersonEntity[]> {
    return computed(() =>
      [...this.$state.persons].sort((a, b) => {
        const firstname = a.firstname.localeCompare(b.firstname, 'de-de')
        if (firstname != 0) {
          return firstname
        }
        return a.lastname.localeCompare(b.lastname, 'de-de')
      })
    )
  }
}

function initialAttendance(): Attendance {
  const saved = window.localStorage.getItem('attendance')
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    trainings: [],
    persons: [],
    person_trainings: [],
  }
}

export const attendanceStore = new AttendanceStore(initialAttendance())
