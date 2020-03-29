const { exec, spawn } = require('child_process')

function execute (command){
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _stderr) => err ? reject(err) : resolve(stdout))
  })
}

async function getVersion () {
  return execute('ocaml --version')
}

function spawnOCaml (channel) {
  const ocaml = spawn('ocaml')

  ocaml.stdout.on('data', (data) => {
    const output = removeHashtag(data.toString())
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

function send (process, code) {
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

function removeHashtag (code) {
  return code.replace(/(# $|#$)/, '')
}

module.exports = { getVersion, spawnOCaml, send, endProcess, addSemicolumn }
