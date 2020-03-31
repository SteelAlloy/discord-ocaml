const Discord = require('discord.js')
const info = require('../package.json')
const logger = require('../src/logger')

function about (channel) {
  const embed = new Discord.MessageEmbed()
    .setColor('#ee760e')
    .setTitle('GitHub repository')
    .setURL('https://github.com/oganexon/discord-ocaml')
    .setAuthor('Author: Oganexon', 'https://avatars1.githubusercontent.com/u/52361520?s=460&u=f872162802853c80c32fb3a4ac2f48e4e47756ce&v=4', 'https://github.com/oganexon')
    .setDescription(info.description)
    .setThumbnail('https://img.icons8.com/color/96/000000/info--v1.png')
    .addField('About OCaml', 'OCaml is an industrial strength programming language supporting functional, imperative and object-oriented styles')
    .addField('About this bot', 'The purpose of this bot is to make OCaml language easier to access and read on channels.')
    .addField('Version', info.version, true)
    // .setImage('https://i.imgur.com/TGSsq2p.png')

  logger.info({ message: 'About page requested', id: channel.id })
  channel.send(embed)
}

module.exports = about
