const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "colorfyimage",
  aliases: [""],
  category: "⚙️ Utility",
  description: "Applies color effects to an image attachment",
  usage: "colorfyimage <effect> <attachment>",
  type: "image",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    if (!args[0]) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle("Please specify a color effect.")
        .setDescription("Usage: `colorfyimage <effect> <attachment>`")
      ]});
    }

    let effect = args[0].toLowerCase();
    let attachment = message.attachments.first();

    if (!attachment) {
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle("Please provide an image attachment.")
      ]});
    }

    let image = await canvacord.Canvas[effect](attachment.url);
    let imgAttachment = new MessageAttachment(image, "colorfyimage.png");

    message.reply({files: [imgAttachment]});
  }
};
