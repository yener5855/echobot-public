const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { autoplay, handlemsg } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "skip",
  category: "🎶 Music",
  aliases: ["voteskip", "s", "vs"],
  description: "Skips the current song",
  usage: "skip",
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      const { channel } = message.member.voice;
      if (!channel) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.join_vc)
        ]});
      }
      const player = client.manager.players.get(message.guild.id);
      if (!player) {
        if (message.guild.me.voice.channel) {
          message.guild.me.voice.disconnect();
          message.reply({embeds: [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          return message.react("⏹️").catch(() => {});
        } else {
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(client.la[ls].common.nothing_playing)
          ]});
        }
      }
      if (channel.id !== player.voiceChannel) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].common.wrong_vc)
          .setDescription(eval(client.la[ls]["cmds"]["music"]["skip"]["variable1"]))
        ]});
      }
      if (player.queue.size == 0) {
        if (player.get("autoplay")) return autoplay(client, player, "skip");
        if (message.guild.me.voice.channel) {
          message.guild.me.voice.disconnect();
          player.destroy();
          message.reply({embeds: [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          return message.react("⏹️").catch(() => {});
        } else {
          player.destroy();
          message.reply({embeds: [new MessageEmbed()
            .setTitle(client.la[ls].cmds.music.skip.title)
            .setColor(es.color)
          ]});
          return message.react("⏹️").catch(() => {});
        }
      }
      player.stop();
      message.reply({embeds: [new MessageEmbed()
        .setTitle(client.la[ls].cmds.music.skip.title2)
        .setColor(es.color)
      ]});
      return message.react("⏭").catch(() => {});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed);
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["skip"]["variable2"]))
      ]});
    }
  }
};
