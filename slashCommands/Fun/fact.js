const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "fact",
  description: "Sends a random fact",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
    let json = await res.json();

    interaction.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Random Fact")
      .setDescription(json.text)
    ]});
  }
};
