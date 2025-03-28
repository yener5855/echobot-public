const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "tweet",
  description: "Generate a fake tweet",
  usage: "tweet <text>",
  category: "🕹️ Fun",
  run: async (client, message, args) => {
    const text = args.join(" ");
    if (!text) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Please provide text for the tweet!")
            .setFooter("Usage: tweet <text>"),
        ],
      });
    }

    const avatar = message.author.displayAvatarURL({ format: "png" });
    const tweetImage = await canvacord.Canvas.tweet({ username: message.author.username, content: text, avatar });

    const attachment = new MessageAttachment(tweetImage, "tweet.png");
    return message.reply({
      files: [attachment],
      embeds: [
        new MessageEmbed()
          .setColor("BLUE")
          .setTitle("📢 Here's your tweet!")
          .setImage("attachment://tweet.png"),
      ],
    });
  },
};
