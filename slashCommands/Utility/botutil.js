const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "botutil",
  description: "Provides bot utility information",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    interaction.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Bot Utility Information")
      .setDescription("This command provides various utility information about the bot.")
    ]});
  }
};
