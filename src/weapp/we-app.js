import _ from 'lodash'
import { autorun, action, createAtom, decorate, observable } from 'mobx'

export default class WeApp {
  $callbacks = []
  $atom = createAtom('we_app_atom')
  $clears = []

  constructor($scope) {
    this.$scope = $scope
  }

  install() {
    const clear = autorun(() => {
      const callbacks = this.$callbacks.splice(0)
      const callback = callbacks.length ? () => callbacks.forEach(cb => cb()) : void 0
      this.$atom.reportObserved()
      this.$scope.setData({ context: this.render() }, callback)
    })
    this.addClear(clear)
  }

  uninstall() {
    this.$clears.forEach(cb => cb())
  }

  update(obj, cb) {
    _.forEach(obj, (value, key) => _.set(this, key, value))
    cb && this.$callbacks.push(cb)
    this.$atom.reportChanged()
  }

  addClear(cb) {
    this.$clears.push(cb)
  }

  wxForFormat(list) {
    const wxForData = []
    Object.defineProperty(wxForData, 'origin_list', {
      enumerable: false,
      configurable: true,
      value: list,
    })
    return wxForData
  }

  wxForEach(wxForData, cb) {
    _.forEach(wxForData.origin_list, (value, key) => {
      const context = {}
      wxForData.push(context)
      cb(value, key, context)
    })
    delete wxForData.origin_list
  }
}

decorate(WeApp, {
  store: observable,
  update: action,
})
