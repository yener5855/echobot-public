const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "randommember",
  description: "Pick a random member from the server",
  category: "🕹️ Fun",
  run: async (client, message) => {
    const members = message.guild.members.cache.filter((member) => !member.user.bot).random();
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor("RANDOM")
          .setTitle("🎲 Random Member")
          .setDescription(`The chosen one is: ${members.user.tag}`)
          .setFooter("Better luck next time!"),
      ],
    });
  },
};
