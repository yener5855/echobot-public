const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "deletebirthday",
  category: "🎂 Birthday",
  aliases: ["delbday"],
  cooldown: 5,
  usage: "deletebirthday",
  description: "Delete your birthday",
  run: async (client, message, args) => {
    // Ensure the directory exists
    const dir = path.resolve("./databases/birthday");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Ensure birthdayDB is initialized
    if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: dir });

    const userId = message.author.id;
    if (!client.birthdayDB.has(userId)) {
      return message.reply('You do not have a birthday set.');
    }

    client.birthdayDB.delete(userId);
    message.reply('Your birthday has been deleted.');
  }
};
