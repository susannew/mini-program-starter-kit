import { WeApp, createComponent } from '@weapp'

@createComponent(require)
export class Counter extends WeApp {
  count = 0

  created() {
    setInterval(() => {
      this.update({ count: this.count + 1 })
    }, 1000)
  }
}
