const { createLogger, format, transports } = require('winston')
const { combine, printf, timestamp } = format

const logger = createLogger({
  level: 'silly',
  format: combine(
    timestamp(),
    format.simple(),
    printf(({ level, message, timestamp, id }) => {
      return `${timestamp} - [${id || 'global'}] ${level}: ${message}`
    })),
  transports: [new transports.Console()],
  handleExceptions: [new transports.Console()],
  colorize: true,
  exitOnError: false
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ message: reason })
  console.log(reason)
})

module.exports = logger
