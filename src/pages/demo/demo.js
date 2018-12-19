import { WeApp, createPage } from '@weapp'
import { action } from 'mobx'

@createPage(require)
export class Demo extends WeApp {
  store = {
    array: [1, 2, 3]
  }

  getTitle() {
    return 'title' + this.store.array.length
  }

  @action
  handleAdd() {
    this.store.array.push(this.store.array.length + 1)
  }
}
