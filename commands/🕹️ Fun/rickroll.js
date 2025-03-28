const Discord = require('discord.js');

module.exports = {
  name: "rickroll",
  description: "Never gonna give you up!",
  category: "🕹️ Fun",
  run: async (client, message) => {
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor("ORANGE")
          .setTitle("🎵 Never Gonna Give You Up!")
          .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
          .setFooter("You just got rickrolled!"),
      ],
    });
  },
};

