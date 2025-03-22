const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');

module.exports = {
  name: "birthday",
  category: "🎂 Birthday",
  aliases: ["bday"],
  cooldown: 5,
  usage: "birthday [@user]",
  description: "Check your or another user's birthday",
  run: async (client, message, args) => {
    // Ensure birthdayDB is initialized
    if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: "./databases/birthday" });

    const user = message.mentions.users.first() || message.author;
    const birthday = client.birthdayDB.get(user.id);
    if (!birthday) {
      return message.reply('No birthday set for this user.');
    }

    message.reply(`${user.username}'s birthday is on ${birthday}.`);
  }
};
