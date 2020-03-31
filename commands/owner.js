const { execute } = require('./_utils')
const config = require('../config.json')
const logger = require('../src/logger')

function owner (message, args) {
  if (message.author.id === config.ownerID) {
    logger.warn({ message: `Owner access: ${message.author}`, id: message.channel.id })
    message.channel.send(':white_check_mark: **You are indeed the owner**')

    switch (args[0]) {
      case 'restart':
        logger.warn({ message: 'Restarting Bot...', id: message.channel.id })
        message.channel.send(':octagonal_sign: **Restarting Bot...**')

        execute('pm2 restart 0', message.channel)
        break

      case 'shutdown':
        logger.warn({ message: 'Shutdown linux server...', id: message.channel.id })
        message.channel.send(':octagonal_sign: **Shutdown linux server...**')

        execute('sudo shutdown -r now', message.channel)
        break

      default:
        break
    }
  } else {
    logger.warn({ message: `Owner access denied: ${message.author}`, id: message.channel.id })
    message.channel.send(':x: **You are not granted permissions**')
  }
}

module.exports = owner
