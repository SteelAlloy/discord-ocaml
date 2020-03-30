const { spawn } = require('child_process')

function runProcess (channel) {
  const ocaml = spawn('ocaml', ['-noprompt'])

  ocaml.stdout.on('data', (data) => {
    const output = data.toString()
    if (output.match(/^\s*$/) !== null) return
    console.log(output)
    channel.send('```ocaml\n' + removeANSI(output) + '\n```')
    if (output.match(/Error/)) {
      const output2 = ANSItoMarkdown(output)
      if (output2.match(/^\s*$/) !== null) return
      channel.send('**Here:**')
      channel.send(output2)
    }
  })

  ocaml.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
    channel.send(`**Process exited with code ${code}**`)
  })

  return ocaml
}

function input (process, code) {
  process.stdin.write(`${addSemicolumn(code)}\r\n`)
}

function endProcess (process) {
  process.stdin.end()
}

function addSemicolumn (code) {
  return code.replace(/(;;\s*$|;\s*$|\s*$)/, ';;')
}

function removeANSI (code) {
  return code
    .replace(/\x1b\[A/g, '')
    .replace(/\x1b\[4m/g, '')
    .replace(/\x1b\[24m/g, '')
}

function ANSItoMarkdown (code) {
  return code
    .replace(/\x1b\[A/g, '')
    .replace(/(\x1b\[4m)(.*)(\x1b\[24m)/gs, '__$2__')
    .replace(/\x1b\[24m/g, '')
    .replace(/Error:.*/gs, '')
}

module.exports = { runProcess, endProcess, input, addSemicolumn }
