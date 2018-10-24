const babel = require('babel-core')
const path = require('path')

function matchArgs(code) {
  const { CLIEngine } = require('eslint')
  const cli = new CLIEngine({
    envs: ['node'],
    useEslintrc: true,
  })
  const report = cli.executeOnText(code)
  return report.results[0].messages.reduce((arr, msg) => {
    if (msg.ruleId === 'no-undef') arr.push(msg.source.slice(msg.column - 1, msg.endColumn - 1))
    return arr
  }, [])
}

function replaceCode(code, cb) {
  const options = require('lodash/templateSettings')
  const reInterpolate = require('lodash/_reInterpolate')
  const reNoMatch = /($^)/
  const reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g
  const interpolate = /<script>([\s\S]+?)<\/script>/g
  const reDelimiters = RegExp(
    (options.escape || reNoMatch).source + '|' +
    interpolate.source + '|' +
    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
    (options.evaluate || reNoMatch).source + '|$'
    , 'g')
  return code.replace(reDelimiters, cb)
}

function handle(wxml) {
  let index = 0

  const func = []

  const result = replaceCode(wxml, word => {
    if (word) {
      // const oneline = /^<%=/.test(word)
      const code = word.replace(/^<%=/, '').replace(/%>$/, '')
      const args = matchArgs(code)
      index++
      func.push(`module.exports.index${index} = function(${args.join(',')}) {return ${code}}`)
      return `{{ m1.index${index}(${args.join(',')}) }}`
    }
    return word
  })
  if (func.length) {
    const { code } = babel.transform(func.join(';'), {
      extends: path.resolve('.babelrc')
    })
    return `<wxs module="m1">${code}</wxs>` + result
  } else {
    return wxml
  }
}

const through = require('through-gulp')
const fs = require('fs-extra')

function gulpWxml(settings) {
  //通过through创建流stream
  return through(
    function (file, encoding, callback) {
      //进程文件判断
      if (file.isNull()) {
        throw 'NO Files,Please Check Files!'
      }
      //buffer对象可以操作
      if (file.isBuffer()) {
        //拿到单个文件buffer
        const content = file.contents.toString('utf-8')
        file.contents = new Buffer(handle(content), 'utf-8')
      }
      //stream流是不能操作的,可以通过fs.readFileSync
      if (file.isStream()) {
        //同步读取
        const content = fs.readFileSync(file.path).toString('utf-8')
        file.contents = new Buffer(handle(content), 'utf-8')
      }
      this.push(file)
      callback()
    },
  )
}

module.exports = gulpWxml
