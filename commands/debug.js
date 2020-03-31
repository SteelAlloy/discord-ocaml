const Discord = require('discord.js')
const prettyBytes = require('pretty-bytes')
const { execute } = require('./_utils')
const { processRunning } = require('../src/processManager')
const ocaml = require('../src/ocaml')
const logger = require('../src/logger')

function debug (channel, args) {
  switch (args[0]) {
    case 'process':
      debugProcess(channel)
      break

    case 'bot':
      debugBot(channel)
      break

    default:
      debugBot(channel)
      debugProcess(channel)
      break
  }
}

async function debugProcess (channel) {
  if (processRunning(channel)) {
    const process = ocaml.processes.get(channel.id)
    const snapshot = await execute(`ps -p ${process.pid} -o %cpu,%mem,etime,cputime h`, channel)
    const stats = snapshot.replace(/(^\s+|\s+$)/g, '').replace(/\s+/g, ' ').split(' ')
    const embed = new Discord.MessageEmbed()
      .setColor('#ee760e')
      .setTitle('Process debug')
      // .setDescription('desc')
      .setThumbnail('https://img.icons8.com/color/96/000000/system-task.png')
      .addField('CPU usage', stats[0] + ' %', true)
      .addField('Memory usage', stats[1] + ' %', true)
      .addField('Time elasped', stats[2], true)
      .addField('Cumulative CPU time', stats[3], true)

    logger.info({ message: `Process Debug: ${stats}`, id: channel.id })
    channel.send(embed)
  } else {
    logger.info({ message: "No process was found for this channel. Couldn't debug process.", id: channel.id })
    channel.send(":information_source: **No process was found for this channel. Couldn't debug process.**")
  }
}

function debugBot (channel) {
  const cpu = new Date(process.cpuUsage().user / 1000)
  const memory = process.memoryUsage()
  const embed = new Discord.MessageEmbed()
    .setColor('#ee760e')
    .setTitle('Bot debug')
    // .setDescription('desc')
    .setThumbnail('https://img.icons8.com/color/96/000000/system-task.png')
    .addField('Allocated memory ', prettyBytes(memory.rss), true)
    .addField('Allocated heap', prettyBytes(memory.heapTotal), true)
    .addField('Used memory', prettyBytes(memory.heapUsed), true)
    .addField('External memory', prettyBytes(memory.external), true)
    .addField('Time spent on CPU', `${cpu.getSeconds()}s${cpu.getMilliseconds()}ms`, true)

  logger.info({ message: `Bot Debug: cpu:${cpu.getTime()}, memory: ${memory}`, id: channel.id })
  channel.send(embed)
}

module.exports = debug
