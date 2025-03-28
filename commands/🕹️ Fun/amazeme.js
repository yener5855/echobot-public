const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const subreddits = [
  "memes",
  "DeepFriedMemes",
  "bonehurtingjuice",
  "surrealmemes",
  "dankmemes",
  "meirl",
  "me_irl",
  "funny"
];
const path = require("path");
const axios = require("axios");

module.exports = {
  name: "amazeme",
  description: "Get an amazing image",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://www.reddit.com/r/interestingasfuck/random/.json");
      const post = response.data[0].data.children[0].data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(post.title)
            .setImage(post.url)
            .setFooter("Source: r/interestingasfuck"),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch an amazing image. Please try again later.");
    }
  },
};
