const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const config = require('../botconfig/config.json');

module.exports = (client) => {
  // Ensure birthdayDB is initialized
  if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: "./databases/birthday" });

  client.on('messageCreate', async (message) => {
    if (message.content.startsWith(`${config.prefix}setbirthday`)) {
      const args = message.content.split(' ');
      const date = args[1];
      if (!date) return message.reply('Please provide a date in the format YYYY-MM-DD.');

      client.birthdayDB.set(message.author.id, date);
      message.reply('Your birthday has been set!');
    }

    if (message.content.startsWith(`${config.prefix}birthday`)) {
      const user = message.mentions.users.first() || message.author;
      const birthday = client.birthdayDB.get(user.id);
      if (!birthday) return message.reply('No birthday set for this user.');

      message.reply(`${user.username}'s birthday is on ${birthday}.`);
    }
  });

  client.on('ready', () => {
    setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      client.birthdayDB.forEach((date, userId) => {
        if (date === today) {
          const user = client.users.cache.get(userId);
          if (user) {
            const guild = client.guilds.cache.first(); // Assuming the bot is in one guild
            const birthdayChannelId = client.settings.get(guild.id, 'birthdayChannel');
            const birthdayChannel = guild.channels.cache.get(birthdayChannelId);
            if (birthdayChannel) {
              birthdayChannel.send(`🎉 Happy Birthday, <@${user.id}>! 🎉`);
            }
            user.send('Happy Birthday!');
          }
        }
      });
    }, 86400000); // Check every 24 hours
  });
};
