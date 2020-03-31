const Discord = require('discord.js')

const ocaml = require('./ocaml')

const embed = new Discord.MessageEmbed()
  .setColor('#ee760e')
  .setTitle(':camel: Help finance the bot and keep this service running!')
  .setURL('https://www.buymeacoffee.com/Oganexon')

function coffee (channel) {
  channel.send({ files: ['https://cdn.buymeacoffee.com/buttons/default-orange.png'] })
  channel.send({ embed: embed })
}

function delayCoffee (channel) {
  setTimeout(() => {
    if (ocaml.processes.has(channel.id)) {
      coffee(channel)
    }
  }, 1000 * 60 * 25)
}

module.exports = { coffeeCommand: coffee, delayCoffee }
