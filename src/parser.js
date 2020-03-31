const config = require('../config.json')
const ocaml = require('./ocaml')
const { processNotRunning } = require('./processManager')

function parse (message) {
  if (processNotRunning(message.channel)) {
    message.channel.send(':warning: **No process was found for this channel.**')
  } else {
    const code = message.content.slice(config.toplevelPrefix.length).trim()
    message.channel.send(`<@${message.author.id}> typed:\n\`\`\`ocaml\n${ocaml.addSemicolumn(message.content)}\n\`\`\``)
    ocaml.input(message.channel, code)
    if (message.channel.type !== 'dm') {
      message.delete()
    }
  }
}

module.exports = parse
