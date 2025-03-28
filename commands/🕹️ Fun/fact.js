const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "fact",
  description: "Get a random fact",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      const { text: fact } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("💡 Random Fact")
            .setDescription(fact),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a fact. Please try again later.");
    }
  },
};

