const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fetch = require("node-fetch");

module.exports = {
  name: "quote",
  description: "Sends a random quote",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let res = await fetch("https://api.quotable.io/random");
    let json = await res.json();

    interaction.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Random Quote")
      .setDescription(`"${json.content}" - ${json.author}`)
    ]});
  }
};
