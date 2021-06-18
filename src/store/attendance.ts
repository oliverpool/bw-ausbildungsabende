import { computed, ComputedRef, Ref } from '@vue/runtime-core'
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
  private saveTrainings() {
    saveArray('trainings', this.$state.trainings)
  }
  private savePersons() {
    saveArray('persons', this.$state.persons)
  }
  private savePersonTrainings() {
    saveArray('person_trainings', this.$state.person_trainings)
  }
  createTraining(training: TrainingEntity): TrainingEntity {
    training.id = this.$state.trainings.length + 1
    this.$state.trainings.push(training)
    this.saveTrainings()
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
    this.savePersons()
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
  getPersonTrainingByTraining(id: Ref<number>): ComputedRef<PersonTrainingEntity[]> {
    return computed(() => this.$state.person_trainings.filter((pt) => pt.training_id == id.value))
  }
  createPersonTraining(person: PersonEntity, training_id: number) {
    this.$state.person_trainings.push({
      person_id: person.id,
      type: person.type,
      training_id,
    })
    this.savePersonTrainings()
  }
  deletePersonTraining(person_id: number, training_id: number) {
    this.$state.person_trainings = this.$state.person_trainings.filter(
      (pt) => pt.person_id != person_id || pt.training_id != training_id
    )
    this.savePersonTrainings()
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
    persons: loadArray('persons'),
    person_trainings: loadArray('person_trainings'),
  }
}

export const attendanceStore = new AttendanceStore(initialAttendance())
