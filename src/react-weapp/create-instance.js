import React from 'react'
import ReactFiberReconciler from 'react-reconciler'
import Element from './element'
import _ from 'lodash'

function handleLoad(Root, props) {
  this.nodeCount = 0
  this.delayList = []
  this.renderer = ReactFiberReconciler({
    now: Date.now,
    createInstance(type, props, wx_self) {
      return Element.createInstance(type, props, wx_self)
    },
    createTextInstance(text, wx_self) {
      return Element.createTextInstance(text, wx_self)
    },
    appendInitialChild(parent, child) {
      parent.appendInitialChild(child)
    },
    appendChild(parent, child) {
      parent.appendChild(child)
    },
    insertBefore(parent, child, before) {
      parent.insertBefore(child, before)
    },
    removeChild(parent, child) {
      parent.removeChild(child)
    },
    commitTextUpdate(element, oldText, newText) {
      element.commitTextUpdate(newText)
    },
    appendChildToContainer(wx_self, child) {
      wx_self.setData({ root: child.key })
    },
    prepareUpdate(element, type, oldProps, newProps) {
      return _.reduce(oldProps, (result, value, key) => {
        if (result) return result
        else if (key !== 'children') return value !== newProps[key]
        else return ['string', 'number'].includes(typeof newProps[key])
      }, false)
    },
    commitUpdate(element, updatePayload, type, oldProps, newProps) {
      element.commitUpdate(newProps)
    },
    supportsMutation: true,
    shouldSetTextContent(type, newProps) {
      return ['string', 'number'].includes(typeof newProps.children)
    },
    resetTextContent(element) {
      element.resetTextContent()
    },
    removeChildFromContainer() {
    },
    getRootHostContext() {
    },
    getChildHostContext() {
    },
    prepareForCommit() {
    },
    resetAfterCommit() {
    },
    finalizeInitialChildren() {
    }
  })
  this.container = this.renderer.createContainer(this, false)
  const root = React.createElement(Root, props)
  this.renderer.updateContainer(root, this.container, null)
}

function handleUnload() {
  this.renderer.updateContainer(null, this.container, null)
}

function handleEvent(e) {
  const node = _.get(e.currentTarget, 'dataset.node', _.get(e.target, 'dataset.node'))
  const event = _.get(this.data.nodes, `${node}.props.bind${e.type}`)
  event && event(e)
}

export function createPage(Root) {
  Page({
    data: {
      nodes: {}
    },

    onLoad() {
      handleLoad.call(this, Root, { params: this.options })
    },

    onUnload: handleUnload,

    handleEvent: handleEvent,
  })
}

export function createShadow(Root) {
  Component({
    properties: {
      element: {
        type: Object,
        value: {},
        observer(newVal, oldVal) {
          if (this.renderer && !_.isEqual(newVal.props, oldVal.props)) {
            const root = React.createElement(this.data.element.type || Root, newVal.props)
            this.renderer.updateContainer(root, this.container, null)
          }
        }
      }
    },

    data: {
      nodes: {}
    },

    attached() {
      handleLoad.call(this, this.data.element.type || Root, this.data.element.props)
    },

    detached: handleUnload,

    methods: {
      handleEvent: handleEvent
    }
  })

  return Root
}
