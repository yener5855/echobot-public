const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const Enmap = require('enmap');

module.exports = {
  name: "listbirthday",
  category: "🎂 Birthday",
  aliases: ["listbday"],
  cooldown: 5,
  usage: "listbirthday",
  description: "List all birthdays",
  run: async (client, message, args) => {
    // Ensure birthdayDB is initialized
    if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: "./databases/birthday" });

    const allBirthdays = client.birthdayDB.fetchEverything();
    if (allBirthdays.size === 0) {
      return message.reply('No birthdays set.');
    }

    let birthdayList = '';
    allBirthdays.forEach((date, userId) => {
      const user = client.users.cache.get(userId);
      if (user) {
        birthdayList += `${user.username}: ${date}\n`;
      }
    });

    const embed = new MessageEmbed()
      .setTitle('List of Birthdays')
      .setDescription(birthdayList)
      .setColor('BLUE');

    message.reply({ embeds: [embed] });
  }
};
