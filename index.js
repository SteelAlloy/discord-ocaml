const Discord = require('discord.js')
const ocaml = require('./src/ocaml')

const client = new Discord.Client()

const config = require("./config.json")

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)
})

client.once('reconnecting', () => {
  console.log('Reconnecting!')
})

client.once('disconnect', () => {
  console.log('Disconnect!')
})

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
})

const instances = new Map()

client.on("message", async message => {
  console.log(message.channel.id)
  console.log(instances)
  if (message.author.bot) return

  if (message.content.indexOf(config.toplevelPrefix) === 0) {
    if (!instances.has(message.channel.id)) {
      newProcess(message.channel)
      message.channel.send(`No process was found for this channel. A new one was created.`)
    } 
    let code = message.content.slice(config.toplevelPrefix.length).trim()
    let ocamlProcess = instances.get(message.channel.id)
    ocaml.send(ocamlProcess, code)
    message.channel.send(`<@${message.author.id}> typed:\n\`\`\`ocaml\n${ocaml.addSemicolumn(message.content)}\n\`\`\``)
    message.delete()
  }

  if (message.content.indexOf(config.prefix) !== 0) return

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command === "get") {
    message.author.send("Hi!")
  }

  if (command === "version") {
    const version = await ocaml.getVersion()
    message.channel.send(version.replace(/(version.+)/, '**$1**'))
  }

  if (command === "spawn" || command === "start") {
    newProcess(message.channel)
  }

  if (command === "exit" || command === "end") {
    endProcess(message.channel)
  }

  if (command === "admin") {
    if (message.author.id !== config.ownerID) return

    message.channel.send("You are the owner")
  }
})

client.login(config.token)

function newProcess (channel) {
  let process = ocaml.spawnOCaml(channel)
  instances.set(channel.id, process)
}

function endProcess (channel) {
  if (instances.has(channel.id)) {
    let ocamlProcess = instances.get(message.channel.id)
    ocaml.endProcess(ocamlProcess)
    instances.delete(channel.id)
  } else {
    message.channel.send(`No process was found for this channel. Couldn't end process.`)
  }
}

/**
let rec last l = match l with
  |[] -> None
  |[a] -> Some a
  |(h::t) -> last t;;
 */
