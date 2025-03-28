const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "pandafact",
  description: "Get a random panda fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://some-random-api.com/facts/panda");
      const { fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🐼 Panda Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a panda fact. Please try again later.");
    }
  },
};

