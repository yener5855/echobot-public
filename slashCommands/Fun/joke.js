const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "joke",
  description: "Sends a random joke",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let res = await fetch("https://official-joke-api.appspot.com/random_joke");
    let json = await res.json();

    interaction.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Random Joke")
      .setDescription(`${json.setup}\n\n${json.punchline}`)
    ]});
  }
};
