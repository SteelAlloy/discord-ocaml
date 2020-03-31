const config = require('../config.json')
const ocaml = require('./ocaml')
const logger = require('./logger')
const { processNotRunning, run } = require('./processManager')

function parse (message) {
  if (processNotRunning(message.channel)) {
    logger.info({ message: 'No process was found for this channel.', id: message.channel.id })
    message.channel.send(':warning: **No process was found for this channel.**')

    run(message.channel)
  }
  const code = message.content.slice(config.toplevelPrefix.length).trim()

  message.channel.send(`<@${message.author.id}> typed:\n\`\`\`ocaml\n${message.content}\n\`\`\``)
  ocaml.input(message.channel, code)

  if (message.channel.type !== 'dm') {
    message.delete()
  }
}

module.exports = parse
