import _ from 'lodash'

export function callOriginFunc(obj, key, args) {
  if (obj[key]) return obj[key](...args)
}

export function createMethod(obj, key) {
  _.set(obj, key, function () {
    return this.weApp[key](...arguments)
  })
}

export const page_options = {
  onLoad() {
    this.weApp = new this.WeAppClass(this)
    const result = callOriginFunc(this.weApp, 'onLoad', arguments)
    this.weApp.install()
    return result
  },
  onUnload() {
    this.weApp.uninstall()
    return callOriginFunc(this.weApp, 'onUnload', arguments)
  }
}

export const component_options = {
  lifetimes: {
    created() {
      this.weApp = new this.data.WeAppClass(this)
      return callOriginFunc(this.weApp, 'created', arguments)
    },
    attached() {
      this.weApp.install()
      return callOriginFunc(this.weApp, 'attached', arguments)
    },
    detached() {
      this.weApp.uninstall()
      return callOriginFunc(this.weApp, 'detached', arguments)
    }
  }
}
