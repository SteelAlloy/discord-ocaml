const { exec } = require('child_process')
const logger = require('../src/logger')

function execute (command, channel) {
  logger.info({ message: `Command requested: ${command}`, id: channel.id })
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _stderr) => err ? reject(err) : resolve(stdout))
  })
}

module.exports = { execute }
