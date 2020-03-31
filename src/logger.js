const { createLogger, format, transports } = require('winston')
const { combine, printf, timestamp } = format

const myFormat = printf(({ level, message, timestamp, id }) => {
  return `${timestamp} - [${id || 'global'}] ${level}: ${message}`
})

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({
      exitOnError: false,
      handleExceptions: true
    })
  ]
})

module.exports = logger
