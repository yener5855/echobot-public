const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "randommember",
  description: "Selects a random member from the guild",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let members = interaction.guild.members.cache.filter(member => !member.user.bot).random();
    interaction.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle(`Random Member: ${members.user.tag}`)
      .setThumbnail(members.user.displayAvatarURL({ dynamic: true }))
    ]});
  }
};
