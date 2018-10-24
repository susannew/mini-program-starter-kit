const _ = require('lodash')
const path = require('path')
const { elements } = require('./ejs-bin')
global.__myImports = {}
global.__hasNewImports = false

function handle(babel_path, state) {
  const value = _.get(babel_path, 'node.source.value')
  if (!value) return
  // if (!state.file.opts.filename.match(path.resolve('src'))) return
  let useNewValue = false
  if (value in global.__myImports) useNewValue = true
  else if (!/^(\.|\/)/.test(value)) {
    global.__myImports[value] = { name: _.camelCase(value) }
    global.__hasNewImports = true
    useNewValue = true
  }
  if (useNewValue) babel_path.node.source.value = path.relative(path.dirname(state.file.opts.filename), path.resolve(`src/lib/${value}`))
}

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration: handle,
      ExportDeclaration: handle,
      JSXElement(babel_path) {
        const { openingElement, closingElement } = babel_path.node
        const { name } = openingElement.name
        if (/^[A-Z]/.test(name)) return
        const block = !!closingElement
        const attr = openingElement.attributes.map(attr => {
          const { name } = attr.name
          return name === 'className' ? 'class' : name
        })
        const event = _.remove(attr, item => /^(bind|catch)/.test(item))
        if (!elements[name]) elements[name] = { attr: [], event: [] }
        elements[name].block = block
        elements[name].attr = _.union(elements[name].attr, attr)
        elements[name].event = _.union(elements[name].event, event)
      }
    }
  }
}
