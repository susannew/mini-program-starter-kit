/* view: {
   block: true,
   attr: ['class', 'style'],
   event: []
} */
const ejs = require('ejs')
const fs = require('fs')

const elements = {}

const data = {
  list: [1, 2, 3, 4, 5],
  elements
}

module.exports = {
  elements,
  ejs_run() {
    ejs.renderFile('/Users/jamie/Code/mini-program-starter-kit/src/react-weapp/render.ejs', data, (err, str) => {
      if (!err) fs.writeFileSync('/Users/jamie/Code/mini-program-starter-kit/dist/react-weapp/render.wxml', str)
    })
  }
}
