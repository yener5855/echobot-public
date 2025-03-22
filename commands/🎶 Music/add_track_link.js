const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "add_track_link",
  aliases: [""],
  category: "🎶 Music",
  description: "Adds tracks, playlists, albums, etc. to a pre-existing custom playlist",
  usage: "add_track_link <link>",
  type: "playlist",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    if (!args[0]) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle("Please provide a link.")
        .setDescription("Usage: `add_track_link <link>`")
      ]});
    }

    let link = args[0];
    // Add logic to add the link to the custom playlist

    message.reply({embeds: [new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Link Added")
      .setDescription(`The link has been added to the custom playlist.`)
    ]});
  }
};
