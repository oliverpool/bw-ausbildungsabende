import { Store } from './main'

interface Click extends Object {
  count: number
}

class ClickStore extends Store<Click> {
  incrementCount() {
    this.$state.count++
  }
}

export const clickStore = new ClickStore({
  count: 0,
})
