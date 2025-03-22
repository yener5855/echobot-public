const {
  EmbedBuilder
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `volume`,
  category: `🎶 Music`,
  aliases: [`vol`],
  description: `Sets the volume of the music player`,
  usage: `volume <0-150>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  options: [
    {"Integer": { name: "amount", description: "The volume amount to set (0-100)", required: true }}, 
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    
    //let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return interaction?.reply({ephemeral: true, embeds : [new EmbedBuilder()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let volume = interaction?.options.getInteger("amount");
      if (volume < 0 || volume > 100) {
        return interaction?.reply({ ephemeral: true, embeds: [new EmbedBuilder()
          .setColor(es.wrongcolor)
          .setTitle("Volume must be between 0 and 100")
        ]});
      }
      player.setVolume(volume);
      return interaction?.reply({ embeds: [new EmbedBuilder()
        .setColor(es.color)
        .setTitle(`Volume set to ${volume}%`)
      ]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed);
      return interaction?.reply({embeds :[new EmbedBuilder()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["volume"]["variable7"]))
      ]});
    }
  }
};
