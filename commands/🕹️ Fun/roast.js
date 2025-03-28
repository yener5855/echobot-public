const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "roast",
  description: "Send a random roast",
  category: "🕹️ Fun",
  run: async (client, message) => {
    try {
      const response = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
      const { insult } = response.data;

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("🔥 Roast Incoming!")
            .setDescription(insult)
            .setFooter("Don't take it personally!"),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Failed to fetch a roast!")
            .setFooter("Please try again later."),
        ],
      });
    }
  },
};

