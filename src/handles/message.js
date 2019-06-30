/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const commands = require('../commands')
const preferencesRepositry = require('../preferences')
const structures = require('../structures')
const translations = require('../translations')

const cooldown = new Array()

const eventHandle = async (client, message) => {
  if (message.author.bot) return // NOTE: Block calling service from bot account.

  const preferences = await structures.preferences.get({
    user: message.author.id,
    guild: message.guild.id
  })
  const permissions = await structures.permissions.get({
    user: message.member,
    guild: message.guild
  })

  const filters =
    (!message.content.startsWith(preferences.guild.prefix)) || // NOTE: If message is not command.
    (message.channel.type === 'dm') // NOTE: If the channel is DM.
  if (filters) return

  // NOTE: States that needs notice.
  if (!message.guild.me.hasPermission('SEND_MESSAGES')) {
    message.reply(translations[preferences.user.language].events.message.leakedPermission)
    return
  }
  if (cooldown.includes(message.author.id)) {
    message.reply(translations[preferences.user.language].events.message.coolingDown.bind({seconds: preferencesRepositry.client.cooldown.timeout / 1000}))
    return
  }

  // NOTE: Parsing message context.
  const arguments = message.content.replace(preferences.guild.prefix, '').split(' ').filter(a => a !== '')
  const command = commands[arguments[0]]
  const parameters = arguments.splice(1)

  // NOTE: Attach values.
  message._parameters = parameters

  if (command) {
    if (structures.permissions.compare(permissions, command.properties.permission)) {
      message.channel.send(translations[preferences.user.language].events.message.scarcePermission.bind({command: command.properties.name}))
      return
    }
    command.execute(client, message, preferences, translations[preferences.user.language].commands[command.properties.name])

    if (preferencesRepositry.client.cooldown.enabled) {
      cooldown.push(message.author.id)

      setTimeout(() => {
        cooldown.splice(cooldown.indexOf(message.author.id), 1)
      }, preferencesRepositry.client.cooldown.timeout)
    }
  }
}

module.exports = eventHandle
