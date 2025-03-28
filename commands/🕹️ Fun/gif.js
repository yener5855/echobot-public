const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "gif",
  description: "Fetch a random GIF",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://api.giphy.com/v1/gifs/random", {
        params: { api_key: "YOUR_GIPHY_API_KEY" },
      });
      const { title, images } = response.data.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title || "Random GIF")
            .setImage(images.original.url)
            .setFooter("Powered by Giphy"),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Failed to fetch a GIF!")
            .setFooter("Please try again later."),
        ],
      });
    }
  },
};

