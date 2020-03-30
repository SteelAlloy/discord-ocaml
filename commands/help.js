function help (channel) {
  channel.send(`**USAGE**
  ocaml _[COMMAND]_
  # _[CODE]_

**COMMANDS**
  \`version\`, \`v\`           OCaml version
  \`help\`, \`h\`                Show this help
  \`start\`, \`run\`           Spawn OCaml
  \`exit\`, \`end\`, \`quit\`  Exit OCaml
  \`get\`                         Get OCaml in private messages

**DESCRIPTION**
  Runs OCaml code via chat

**EXAMPLES**
  \`# let x = 5;;\`
  `)
}

module.exports = help
