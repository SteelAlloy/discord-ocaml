const logger = require('../src/logger')

function get (author) {
  logger.verbose({ message: `OCaml is now in touch with: ${author}` })
  author.send(':camel: **Hi! Type `ocaml h` to show help.**')
}

module.exports = get
