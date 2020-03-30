const { execute } = require('./_utils')

async function version (channel) {
  const v = await execute('ocaml --version')
  channel.send(`**${v}**`)
}

module.exports = version
