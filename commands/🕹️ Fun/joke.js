const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "joke",
  description: "Get a random joke",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
      const { setup, punchline } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("😂 Random Joke")
            .setDescription(`${setup}\n\n${punchline}`),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply("❌ Failed to fetch a joke. Please try again later.");
    }
  },
};
