const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "meme",
  description: "Fetch a random meme from Reddit",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://meme-api.com/gimme");
      const { title, url, postLink } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setURL(postLink)
            .setImage(url)
            .setFooter("Powered by meme-api.com"),
        ],
      });
    } catch (error) {
      console.error(error);

      // Handle specific HTTP errors
      if (error.response && error.response.status === 530) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setTitle("❌ Meme API is currently unavailable!")
              .setDescription("Please try again later or contact the bot administrator.")
              .setFooter("Error Code: 530"),
          ],
        });
      }

      // Generic error fallback
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Failed to fetch a meme!")
            .setFooter("Please try again later."),
        ],
      });
    }
  },
};
