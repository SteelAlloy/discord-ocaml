const ocaml = require('./ocaml')
const logger = require('./logger')
const { delayCoffee } = require('./coffee')

function processRunning (channel) {
  return ocaml.processes.has(channel.id)
}

function processNotRunning (channel) {
  return !processRunning(channel)
}

function run (channel) {
  if (processRunning(channel)) {
    logger.verbose({ message: 'A process is already running', id: channel.id })
    channel.send(':information_source: **A process is already running.**')
  } else {
    const process = ocaml.runProcess(channel)

    ocaml.processes.set(channel.id, process)
    ocaml.lastUses.set(channel.id, new Date().getTime())

    standby(channel)
    delayCoffee(channel)

    logger.verbose({ message: 'A new process is running. This process will exit after 10 minutes of inactivity.', id: channel.id })
    channel.send(':information_source: **A new process is running. This process will exit after 10 minutes of inactivity.**')
  }
}

function end (channel) {
  if (processRunning(channel)) {
    const process = ocaml.processes.get(channel.id)

    ocaml.endProcess(process)
  } else {
    logger.verbose({ message: "No process was found for this channel. Couldn't end process.", id: channel.id })
    channel.send(":information_source: **No process was found for this channel. Couldn't end process.**")
  }
}

const interval = 1000 * 60
const timeout = 1000 * 60 * 10

function standby (channel) {
  const lastUse = ocaml.lastUses.get(channel.id)

  if (lastUse) {
    if (new Date().getTime() - lastUse >= timeout) {
      logger.verbose({ message: `The process has been inactive for ${timeout / 60000} minutes. It was shut down.`, id: channel.id })
      channel.send(`:clock2: **The process has been inactive for ${timeout / 60000} minutes. It was shut down.**`)

      end(channel)
    } else {
      setTimeout(() => standby(channel), interval)
    }
  }
}

module.exports = { processRunning, processNotRunning, run, end }
