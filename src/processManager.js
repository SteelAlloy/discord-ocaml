const ocaml = require('./ocaml')

const processes = new Map()

function processRunning (channel) {
  return processes.has(channel.id)
}

function processNotRunning (channel) {
  return !processRunning(channel)
}

function run (channel, userRequest) {
  if (processRunning(channel)) {
    console.log('A process is already running.')
    if (userRequest) {
      channel.send('**A process is already running.**')
    }
  } else {
    const process = ocaml.runProcess(channel)
    processes.set(channel.id, process)
    console.log('New process running.')
    channel.send('**A new process is running. This process will exit after 10 minutes of inactivity.**')
  }
}

function end (channel, userRequest) {
  if (processRunning(channel)) {
    const process = processes.get(channel.id)
    ocaml.endProcess(process)
    processes.delete(channel.id)
  } else {
    console.log("No process was found for this channel. Couldn't end process.")
    if (userRequest) {
      channel.send("**No process was found for this channel. Couldn't end process.**")
    }
  }
}

module.exports = { processRunning, processNotRunning, run, end, processes }
