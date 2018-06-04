console.log('Starting up at ' + new Date())
// NOTE: You can use 'non-production' branch as Heroku version
const Discord = require('discord.js')

const _application = require('./application')
const _data = require('./data')
const _prompts = require('./prompts')

const client = new Discord.Client({autoReconnect: true})
const endpoints = {
  prefix: ';', // NOTE: new RegExp('^<@!?Client ID>')
  Discord: '!aNull' // NOTE: process.env.Discord
}
const prompts = new Map()

_application.initialize.prompts(prompts, _prompts)

process.on('unhandledRejection', (error) => {
  console.error(error.stack)
})

client.login(endpoints.Discord)
client.on('ready', () => {
  console.log(client.user.tag)
  client.user.setActivity(endpoints.prefix + 'help (Initialized, ' + require('./package.json').version + ')')
  client.user.setStatus('online')
})
client.on('message', (message) => {
  try {
    if (message.channel.permissionsFor(message.author).has('MANAGE_GUILD')) { permissions = 2 } else { permissions = 0 }
    if (message.author.id === '324541397988409355') permissions = 4
    const prompt = prompts.get(message.content.split(' ')[0].slice(endpoints.prefix.length).toLowerCase())
    const notAllowed =
      (message.author.bot)
      || (message.channel.type === 'dm')
      || (!message.content.startsWith(endpoints.prefix))
      || (!prompt)
      || (permissions < prompt.worker.permissions)
    if (notAllowed) { return }
    const nt = {
      arguments: message.content.split(' ').slice(1),
      i: _application.translations(prompt.language)
    }
    prompt.worker.execute(client, message, nt)
  } catch (error) {
    console.log(error)
  }
})
