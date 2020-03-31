const ocaml = require('./ocaml')

function processRunning (channel) {
  return ocaml.processes.has(channel.id)
}

function processNotRunning (channel) {
  return !processRunning(channel)
}

function run (channel) {
  if (processRunning(channel)) {
    console.log('A process is already running.')
    channel.send(':information_source: **A process is already running.**')
  } else {
    const process = ocaml.runProcess(channel)
    ocaml.processes.set(channel.id, process)
    ocaml.lastUses.set(channel.id, new Date().getTime())
    standby(channel)
    console.log('New process running.')
    channel.send(':information_source: **A new process is running. This process will exit after 10 minutes of inactivity.**')
  }
}

function end (channel) {
  if (processRunning(channel)) {
    const process = ocaml.processes.get(channel.id)
    // ocaml.processes.delete(channel.id)
    // ocaml.lastUses.delete(channel.id)
    ocaml.endProcess(process)
  } else {
    console.log("No process was found for this channel. Couldn't end process.")
    channel.send(":information_source: **No process was found for this channel. Couldn't end process.**")
  }
}

const interval = 1000 * 60
const timeout = 1000 * 60 * 10

function standby (channel) {
  const lastUse = ocaml.lastUses.get(channel.id)
  if (lastUse) {
    if (new Date().getTime() - lastUse >= timeout) {
      channel.send(`:clock2: **The process has been inactive for ${timeout / 60000} minutes. It was shut down.**`)
      end(channel)
    } else {
      setTimeout(() => standby(channel), interval)
    }
  }
}

module.exports = { processRunning, processNotRunning, run, end }
