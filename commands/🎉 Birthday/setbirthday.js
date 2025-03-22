const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const path = require('path');
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
  name: "setbirthday",
  category: "🎂 Birthday",
  aliases: ["setbday"],
  cooldown: 5,
  usage: "setbirthday <YYYY-MM-DD>",
  description: "Set your birthday",
  run: async (client, message, args) => {
    // Ensure the directory exists
    const dir = path.resolve("./databases/birthday");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Ensure birthdayDB is initialized
    if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: dir });

    const date = args[0];
    if (!date) {
      return message.reply('Please provide a date in the format YYYY-MM-DD.');
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return message.reply('Invalid date format. Please use YYYY-MM-DD.');
    }

    // Validate if the date is a real calendar date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return message.reply('Invalid date. Please provide a real calendar date.');
    }

    client.birthdayDB.set(message.author.id, date);
    message.reply('Your birthday has been set!');
  }
};
