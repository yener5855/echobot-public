const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "catfact",
  description: "Get a random cat fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://some-random-api.com/facts/cat");
      const { fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🐱 Cat Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a cat fact. Please try again later.");
    }
  },
};

