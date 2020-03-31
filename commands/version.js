const { execute } = require('./_utils')
const logger = require('../src/logger')

async function version (channel) {
  const v = await execute('ocaml --version', channel)

  logger.verbose({ message: `Version: ${v}`, id: channel.id })
  channel.send(`:package: **${v}**`)
}

module.exports = version
