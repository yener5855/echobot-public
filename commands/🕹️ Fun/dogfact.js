const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "dogfact",
  description: "Get a random dog fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://some-random-api.com/facts/dog");
      const { fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🐶 Dog Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a dog fact. Please try again later.");
    }
  },
};

