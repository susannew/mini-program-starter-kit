const diff = require('deep-diff').diff;

z1 = { a: 1, b: 1 }
z2 = { a: 2 }
z3 = { a: 3 }

const lhs = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    arr: [1, 2],
    with: [z1, z2, z3]
  }
};

const rhs = {
  a: 1,
  // name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    arr: [1],
    with: [{ a: 0 }, z1, z2, z3],
  }
};

const differences = diff(lhs, rhs)

console.warn(differences)

function parse(arr) {
  return arr.join('.').replace(/\.\d+/g, num => `[${num.slice(1)}]`)
}

function getResult(key, value) {
  console.warn({ [key]: value })
}

differences.forEach(item => {
  const { kind, path, index, rhs } = item
  if (kind === 'N') {
    getResult(parse(path), rhs)
  }

  else if (kind === 'D') {
    getResult(parse(path), rhs)
  }

  else if (kind === 'E') {
    getResult(parse(path), rhs)
  }

  else if (kind === 'A') {
    getResult(parse(path) + `[${index}]`, item.item.rhs)
  }
})

