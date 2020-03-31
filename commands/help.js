const Discord = require('discord.js')
const logger = require('../src/logger')

const embed = new Discord.MessageEmbed()
  .setColor('#ee760e')
  .setTitle('**Help Menu**')
  .addField('**USAGE**',
  `ocaml _[COMMAND]_
  # _[CODE]_`)
  // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setDescription('Some description here')
  .setThumbnail('https://img.icons8.com/color/96/000000/help--v1.png')
  .addField('**COMMANDS**', `
  \`start\`, \`run\` 
  \`end\`, \`exit\`, \`quit\`
  \`r\`, \`reboot\`, \`restart\`
  \`d\`, \`debug\` \`[bot, process]\`
  \`v\`, \`version\`
  \`h\`, \`help\`
  \`get\``, true)
  .addField('Description', `
  \`➡️\` Create an OCaml process
  \`➡️\` End the OCaml process
  \`➡️\` Restart the OCaml process
  \`➡️\` Debug the bot/ the process
  \`➡️\` OCaml version
  \`➡️\` Show this help
  \`➡️\` Get OCaml in private messages`, true)
  .addField('**DESCRIPTION**', 'Runs OCaml code via chat')
  .addField('**EXAMPLES**',
  `\`ocaml start\`
  \`# let x = 5;;\``)

function help (channel) {
  logger.verbose({ message: 'Help has been requested', id: channel.id })
  channel.send({ embed: embed })
}

module.exports = help
