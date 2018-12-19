const path = require('path')
const fs = require('fs-extra')
const { html2json, json2html } = require('html2json')
const _ = require('lodash')
const { minify } = require('html-minifier')
const prettier = require('prettier')
const { parseContext } = require('./parse-mustache')
const parseCodeBinding = require('./parse-code-binding')

function instructRender(attr = {}) {
  let compiled = _.template('<%= code %>')
  if (attr['wx:if']) {
    const text = parseContext(attr['wx:if'], id => attr['wx:if'] = `{{${id}}}`)
    compiled = _.template(`if(${text}) { <%= code %> }`)
  }

  else if (attr['wx:elif']) {
    const text = parseContext(attr['wx:elif'], id => attr['wx:elif'] = `{{${id}}}`)
    compiled = _.template(`else if(${text}) { <%= code %> }`)
  }

  else if (attr['wx:else']) {
    compiled = _.template(`else { <%= code %> }`)
  }

  if (attr['wx:for']) {
    const item_name = _.get(attr, 'wx:for-item', 'item')
    const index_name = _.get(attr, 'wx:for-index', 'index')
    const text = parseContext(
      attr['wx:for'],
      id => attr['wx:for'] = `{{${id}}}`,
      t => `wxForFormat(${t})`
    )
    compiled = _.template(
      compiled({
        code: `wxForEach(${text}, (${item_name}, ${index_name}, context)=> { <%= code %> })`
      })
    )
    attr['wx:for-item'] = 'context'
  }

  const other_props = _.omit(attr, ['wx:if', 'wx:elif', 'wx:else', 'wx:for', 'wx:for-item', 'wx:for-index'])

  return {
    compiled,
    codes: _.map(other_props, (value, key) => {
      return parseContext(value, id => attr[key] = `{{${id}}}`)
    })
  }
}

function each(child) {
  return child.reduce((results, item) => {
    if (item.node === 'element') {
      const { compiled, codes } = instructRender(item.attr)
      if (item.child) {
        codes.push(...each(item.child))
      }
      const result = compiled({ code: codes.join(';') })
      results.push(result)
    }

    else {
      results.push(
        parseContext(item.text, id => item.text = `{{${id}}}`)
      )
    }

    return results
  }, [])
}

module.exports = function (file, wxml) {
  const html = minify(wxml, { collapseWhitespace: true, removeComments: true })
  const json = html2json(html)
  const code = each(json.child).join(';')
  const render = parseCodeBinding(
    `module.exports = function render(){const context = {}; ${code}; return context }`
  )
  const result = prettier.format(render, { parser: 'babylon' })
  const dir = path.dirname(file.path).replace(path.resolve('src'), path.resolve('dist'))
  const filename = 'weapp-render.js'
  fs.outputFileSync(
    path.join(dir, filename),
    result
  )
  // console.warn(result)
  return json2html(json)
}
