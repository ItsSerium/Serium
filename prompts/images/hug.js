const NekosLifeAPI = require('@structures/NekosLifeAPI')

let basedEmbed = {
  embed: {
    title: null,
    image: {
      url: null
    }
  }
}

const Prompt = (message, client) => {
  NekosLifeAPI.sfw.hug().then(response => {
    let targeted = message._se.data[0]

    if (targeted) {
      if (message.mentions.members.first()) {
        targeted = message.mentions.members.first().user.username
      }

      basedEmbed.embed.title = `헉... ${message.author.username}님이랑 ${targeted}님이랑 사귄데요오~`
    } else {
      basedEmbed.embed.title = '헤에... 나도... 나두나두 안아줘어~ >~<'
    }

    basedEmbed.embed.image.url = reponse.url
    message.channel.send(basedEmbed)
  }).catch(error => {
    message.reply('지금은 안아주기 싫은뎅... (주섬주섬')
  })
}
const Properties = {
  name: 'hug',
  description: 'Let me hug someone! also can be used with mention to hug someone.',
  usage: 'hug [someone-or-mention]',

  requiredPermission: 'public'
}

module.exports = Prompt
module.exports.properties = Properties
