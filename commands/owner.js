const { execute } = require('./_utils')
const config = require('../config.json')

function owner (message, args) {
  if (message.author.id === config.ownerID) {
    message.channel.send(':white_check_mark: **You are the owner**')
    switch (args[0]) {
      case 'restart':
        message.channel.send(':octagonal_sign: **Restarting Bot...**')
        execute('pm2 restart 0')
        break

      case 'shutdown':
        message.channel.send(':octagonal_sign: **Shutdown linux server...**')
        execute('sudo shutdown -r now')
        break

      default:
        break
    }
  } else {
    message.channel.send(':x: **You are not granted permissions**')
  }
}

module.exports = owner
