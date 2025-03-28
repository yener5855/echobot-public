const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "birdfact",
  description: "Get a random bird fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://some-random-api.com/facts/bird");
      const { fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🐦 Bird Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a bird fact. Please try again later.");
    }
  },
};

