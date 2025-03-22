const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "randommember",
  aliases: [""],
  category: "🕹️ Fun",
  description: "Selects a random member from the guild",
  usage: "randommember",
  type: "random",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    let members = message.guild.members.cache.filter(member => !member.user.bot).random();
    message.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle(`Random Member: ${members.user.tag}`)
      .setThumbnail(members.user.displayAvatarURL({ dynamic: true }))
    ]});
  }
};
