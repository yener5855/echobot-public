const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "simprate",
  description: "Get a random simp rate",
  category: "🕹️ Fun",
  run: async (client, message) => {
    const simprate = Math.floor(Math.random() * 101);

    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("💘 Simp Rate")
          .setDescription(`You are ${simprate}% simp!`),
      ],
    });
  },
};

