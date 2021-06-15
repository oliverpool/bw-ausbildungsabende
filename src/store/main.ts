import { reactive, readonly, watch, ref, Ref } from 'vue'

export abstract class Store<T extends Object> {
  protected $state: T

  constructor(data: T) {
    this.$state = reactive(data) as T
  }

  public get state(): T {
    return readonly(this.$state) as T
  }
}
