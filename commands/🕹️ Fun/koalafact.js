const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "koalafact",
  description: "Get a random koala fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://some-random-api.com/facts/koala");
      const { fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🐨 Koala Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a koala fact. Please try again later.");
    }
  },
};

