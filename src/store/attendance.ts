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
  trainingCreate(training: TrainingEntity): TrainingEntity {
    training.id = this.$state.trainings.length + 1
    this.$state.trainings.push(training)
    this.save()
    return training
  }
  private save() {
    const serial = JSON.stringify(this.$state)
    window.localStorage.setItem('attendance', serial)
  }
  get latestTrainings(): ComputedRef<TrainingEntity[]> {
    return computed(() => this.$state.trainings.slice(-5).reverse())
  }
  getTraining(id: number): TrainingEntity | undefined {
    return this.$state.trainings.find((t) => t.id == id)
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
