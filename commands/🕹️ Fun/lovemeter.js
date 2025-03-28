const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "lovemeter",
  description: "Check the love compatibility between two users",
  usage: "lovemeter <user1> <user2>",
  category: "🕹️ Fun",
  run: async (client, message, args) => {
    const user1 = args[0] || message.author.username;
    const user2 = args[1] || "someone special";
    const lovePercentage = Math.floor(Math.random() * 101);
    const color = "#FF0000"; // Example of a valid hex color

    return message.reply({
      embeds: [
        new MessageEmbed()// Ensure this is a valid color
          .setColor(/^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : "RED") // Fallback to "RED" if invalid
          .setTitle("💖 Love Meter")
          .setDescription(`${user1} ❤️ ${user2} = ${lovePercentage}%`)
          .setFooter("Love is in the air!"),
      ],
    });
  },
};

