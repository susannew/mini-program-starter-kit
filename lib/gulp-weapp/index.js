const through = require('through-gulp')
const fs = require('fs-extra')
const main = require('./main')

module.exports = function () {
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
        file.contents = new Buffer(main(file, content), 'utf-8')
      }
      //stream流是不能操作的,可以通过fs.readFileSync
      if (file.isStream()) {
        //同步读取
        const content = fs.readFileSync(file.path).toString('utf-8')
        file.contents = new Buffer(main(file, content), 'utf-8')
      }
      this.push(file)
      callback()
    }
  )
}
