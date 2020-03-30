const config = require('../config.json')
const ocaml = require('./ocaml')
const { processNotRunning, run, processes } = require('./processManager')

function parse (message) {
  if (processNotRunning(message.channel)) {
    run(message.channel)
    message.channel.send('**No process was found for this channel. A new one was created.**')
  }
  const code = message.content.slice(config.toplevelPrefix.length).trim()
  const process = processes.get(message.channel.id)
  ocaml.input(process, code)
  message.channel.send(`<@${message.author.id}> typed:\n\`\`\`ocaml\n${ocaml.addSemicolumn(message.content)}\n\`\`\``)
  if (message.channel.type !== 'dm') {
    message.delete()
  }
}

module.exports = parse
