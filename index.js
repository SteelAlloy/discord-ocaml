const Discord = require('discord.js')
const ocaml = require('./src/ocaml')

const client = new Discord.Client()

const config = require('./config.json')
const package = require('./package.json')

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
  // console.log(message.channel.id)
  // console.log(instances)
  if (message.author.bot) return

  if (message.content.indexOf(config.toplevelPrefix) === 0) {
    if (!instances.has(message.channel.id)) {
      newProcess(message.channel)
      message.channel.send('**No process was found for this channel. A new one was created.**')
    }
    let code = message.content.slice(config.toplevelPrefix.length).trim()
    let ocamlProcess = instances.get(message.channel.id)
    ocaml.send(ocamlProcess, code)
    message.channel.send(`<@${message.author.id}> typed:\n\`\`\`ocaml\n${ocaml.addSemicolumn(message.content)}\n\`\`\``)
    if (message.channel.type !== 'dm') {
      message.delete()
    }
  }

  if (message.content.indexOf(config.prefix) !== 0) return

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  switch (command) {
    case 'get':
      message.author.send("**Hi! Type `ocaml h` to show help.**")
      console.log(message.author)
      break

    case 'version':
    case 'v':
      const version = await ocaml.getVersion()
      message.channel.send(`**${version}**`)
      break

    case 'run':
    case 'start':
      newProcess(message.channel)
      break

    case 'exit':
    case 'end':
      endProcess(message.channel)
      break

    case 'help':
    case 'h':
      getHelp(message.channel)
      break

    case 'about':
      getAbout(message.channel)
      break

    case 'admin':
      if (message.author.id !== config.ownerID) {
        message.channel.send("You are the owner")
      }
      break

    default:
      message.channel.send(`**Unknown command: \`${command}\`.**`)
      getHelp(message.channel)
      break
  }

})

client.login(config.token)

function newProcess (channel) {
  if (instances.has(channel.id)) {
    console.log(`A process is already running.`)
    channel.send(`**A process is already running.**`)
  } else {
    let process = ocaml.spawnOCaml(channel)
    instances.set(channel.id, process)
    console.log(`A process is already running.`)
    channel.send(`**This process will exit after 10 minutes of inactivity.**`)
  }
}

function endProcess (channel) {
  if (instances.has(channel.id)) {
    let ocamlProcess = instances.get(channel.id)
    ocaml.endProcess(ocamlProcess)
    instances.delete(channel.id)
  } else {
    console.log(`No process was found for this channel. Couldn't end process.`)
    channel.send(`**No process was found for this channel. Couldn't end process.**`)
  }
}

function getAbout (channel) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#ee760e')
    .setTitle('GitHub repository')
    .setURL('https://github.com/oganexon/discord-ocaml')
    .setAuthor('Author: Oganexon', 'https://avatars1.githubusercontent.com/u/52361520?s=460&u=f872162802853c80c32fb3a4ac2f48e4e47756ce&v=4', 'https://github.com/oganexon')
    .setDescription(package.description)
    .setThumbnail('https://img.icons8.com/nolan/96/inspect-code.png')
    .addField('About OCaml', 'OCaml is an industrial strength programming language supporting functional, imperative and object-oriented styles')
    .addField('About this bot', 'The purpose of this bot is to make OCaml language easier to access and read on channels.')
    .addField('Version', package.version, true)
    .setImage('https://i.imgur.com/TGSsq2p.png')

  channel.send(exampleEmbed);
}

function getHelp (channel) {
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
  // channel.send({
  //     embed: {
  //       color: 3447003,
  //       author: {
  //         name: client.user.username,
  //         icon_url: client.user.avatarURL
  //       },
  //       title: "This is an embed",
  //       url: "http://google.com",
  //       description: "This is a test embed to showcase what they look like and what they can do.",
  //       fields: [{
  //         name: "Fields",
  //         value: "They can have different fields with small headlines."
  //       },
  //       {
  //         name: "Masked links",
  //         value: "You can put [masked links](http://google.com) inside of rich embeds."
  //       },
  //       {
  //         name: "Markdown",
  //         value: "You can put all the *usual* **__Markdown__** inside of them."
  //       },
  //       {
  //         name: "Console",
  //         value: ["```ocaml",
  //           "let rec last l = match l with",
  //           "|[] -> None",
  //           "|[a] -> Some a",
  //           "|(h::t) -> last t;;",
  //           "```"].concat()
  //       }
  //       ],
  //       timestamp: new Date(),
  //       footer: {
  //         icon_url: client.user.avatarURL,
  //         text: "© Example"
  //       }
  //     }
  //   })
  // const exampleEmbed = new Discord.MessageEmbed()
  // .setColor('#0099ff')
  // .setTitle('Some title')
  // .setURL('https://discord.js.org/')
  // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
  // .setDescription('Some description here')
  // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  // .addFields(
  // 	{ name: 'Regular field title', value: 'Some value here' },
  // 	{ name: '\u200B', value: '\u200B' },
  // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
  // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
  // )
  // .addField('Inline field title', 'Some value here', true)
  // .setImage('https://i.imgur.com/wSTFkRM.png')
  // .setTimestamp()
  // .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

  // channel.send(exampleEmbed);
}
