const logger = require('../src/logger')

function get (message) {
  logger.verbose({ message: `Help has been requested from ${message.author}`, id: message.channel.id })
  message.author.send(':camel: **Hi! Type `ocaml h` to show help.**')
}

module.exports = get
