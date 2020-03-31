const Discord = require('discord.js')

const embed = new Discord.MessageEmbed()
  .setColor('#ee760e')
  .setTitle('**Help Menu**')
  .addField('**USAGE**',
  `ocaml _[COMMAND]_
  # _[CODE]_`)
  // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setDescription('Some description here')
  .setThumbnail('https://img.icons8.com/color/96/000000/help--v1.png')
  .addField('**COMMANDS**',
  `\`version\`, \`v\`
  \`help\`, \`h\`
  \`start\`, \`run\` 
  \`exit\`, \`end\`, \`quit\`
  \`get\``, true)
  .addField('Description',
  `\`➡️\` OCaml version
  \`➡️\` Show this help
  \`➡️\` Spawn OCaml
  \`➡️\` Exit OCaml
  \`➡️\` Get OCaml in private messages`, true)
  .addField('**DESCRIPTION**', 'Runs OCaml code via chat')
  .addField('**EXAMPLES**',
  `\`ocaml start\`
  \`# let x = 5;;\``)

function help (channel) {
  channel.send({ embed: embed })
}

module.exports = help
