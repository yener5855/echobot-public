const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "listbirthdays",
  category: "🎂 birthday",
  usage: "listbirthdays",
  description: "List all birthdays",
  run: async (client, message) => {
    const birthdays = client.birthdayDB.fetchEverything();
    if (!birthdays.size) return message.reply('No birthdays set.');

    const embed = new MessageEmbed()
      .setTitle('Birthdays')
      .setDescription(birthdays.map((date, userId) => `<@${userId}>: ${date}`).join('\n'));

    message.channel.send({ embeds: [embed] });
  }
};
