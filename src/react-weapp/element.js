import _ from 'lodash'

export default class Element {
  key: string
  wx_self: Object

  node: { type: string, text?: string | number, props?: Object, children: Array }

  static createInstance(type, props, wx_self) {
    const element = new Element(wx_self)
    const text = ['string', 'number'].includes(typeof props.children) ? props.children : null
    element.setData(`nodes.${element.key}`, { type, text, props: element.filterProps(props), children: [] })
    return element
  }

  static createTextInstance(text, wx_self) {
    const element = new Element(wx_self)
    element.setData(`nodes.${element.key}`, { type: '', text })
    return element
  }

  constructor(wx_self) {
    this.wx_self = wx_self
    this.key = this.randomString()
  }

  get node() {
    return this.wx_self.data.nodes[this.key]
  }

  appendInitialChild(child: Element) {
    this.setData(`nodes.${this.key}.children`, this.node.children.concat(child.key))
  }

  appendChild(child: Element) {
    const children = this.node.children.filter(v => v !== child.key)
    children.push(child.key)
    this.setData(`nodes.${this.key}.children`, children)
  }

  insertBefore(child, before) {
    const children = this.node.children.filter(v => v !== child.key)
    children.splice(children.indexOf(before.key), 0, child.key)
    this.setData(`nodes.${this.key}.children`, children)
  }

  removeChild(child) {
    this.setData(`nodes.${this.key}.children`, this.node.children.filter(key => key !== child.key))
    this.setData(`nodes.${child.key}`, null)
  }

  resetTextContent() {
    this.setData(`nodes.${this.key}.text`, null)
  }

  commitTextUpdate(text) {
    this.setData(`nodes.${this.key}.text`, text)
  }

  commitUpdate(props) {
    if (['string', 'number'].includes(typeof props.children)) this.setData(`nodes.${this.key}.text`, props.children)
    this.setData(`nodes.${this.key}.props`, this.filterProps(props))
  }

  setData(key, value) {
    clearTimeout(this.wx_self.timer)
    this.wx_self.delayList.push(key.split('.').slice(0, 2).join('.'))
    _.set(this.wx_self.data, key, value)
    this.wx_self.timer = setTimeout(() => {
      const d = {}
      this.wx_self.delayList.forEach(key => {
        d[key] = _.get(this.wx_self.data, key)
      })
      this.wx_self.delayList = []
      this.wx_self.setData(d)
    }, 0)
  }

  filterProps(props) {
    const result = _.omit(props, 'children')
    result._event = {}
    _.forEach(result, (value, key) => {
      if (typeof value === 'function') result._event[key] = true
      if (key === 'className') result.class = value
    })
    return result
  }

  randomString() {
    return `node_${++this.wx_self.nodeCount}`
  }
}
