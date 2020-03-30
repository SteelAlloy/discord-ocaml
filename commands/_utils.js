const { exec } = require('child_process')

function execute (command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _stderr) => err ? reject(err) : resolve(stdout))
  })
}

module.exports = { execute }
