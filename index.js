const Discord = require('discord.js')

const handles = require('./handles')
const structures = require('./structures')

const {PreferenceIndicator} = structures

process.on('unhandledRejection', detailed => {
  if (!detailed) detailed = 'No detail provided.'
  console.log(chalk.bgRed('UnhandledRejection:'), detailed)
})

console.log(`Planning application...`)

const client = new Discord.Client(PreferenceIndicator.Discord.Client)

client.once('ready', () => handles.ready(client))
client.on('message', message => handles.message(message, client))
// client.on('guild_member_add', member => handles.guildMemberAdd(member, client))

client.login(PreferenceIndicator.App.Token)
