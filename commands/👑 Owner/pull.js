const { exec } = require('child_process');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
const githubToken = process.env.GITHUB_TOKEN;
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
  name: "pull",
  aliases: [],
  category: "?? Owner",
  description: "Pull the latest changes from the GitHub repository.",
  usage: "{prefix}pull",
  run: async (client, message, args) => {
    try {
      // Check if the message starts with the configured prefix
      if (!message.content.startsWith(config.prefix)) return;

      // Developer's Discord ID
      const developerId = '809533218205466674';

      // Check if the user is the developer
      if (message.author.id !== developerId) {
        return message.reply('You do not have permission to use this command.');
      }

      // Check if the user has the required permissions
      const member = message.guild.members.cache.get(message.author.id);
      if (!member || !member.permissions.has('ADMINISTRATOR')) {
        return message.reply('You do not have permission to use this command.');
      }

      console.log("Current Directory:", process.cwd());

      // Stash local changes
      exec('git -C /home/echo-bot stash', (stashError, stashStdout, stashStderr) => {
        if (stashError) {
          console.error(`Stash error: ${stashError}`);
          return message.reply(`Error stashing changes: ${stashStderr}`);
        }

        // Execute the git pull command
        exec(`git -C /home/echo-bot pull https://${process.env.GITHUB_TOKEN}@github.com/yener5855/echo-bot.git`, (pullError, pullStdout, pullStderr) => {
          if (pullError) {
            console.error(`Pull error: ${pullError}`);
            return message.reply(`Error pulling from GitHub: ${pullStderr}`);
          }

          if (pullStdout.includes("Already up to date.")) {
            const upToDate = new MessageEmbed()
              .setColor('GREEN')
              .setDescription(`Already up to date.`);

            message.reply({ embeds: [upToDate] });
            return;
          } else {
            // Pop the stash to reapply local changes
            exec('git -C /home/echo-bot stash pop', (popError, popStdout, popStderr) => {
              if (popError) {
                console.error(`Stash pop error: ${popError}`);
                return message.reply(`Error popping stash: ${popStderr}`);
              }

              // Fetch the announcement channel
              const announcementChannelId = '1265257307202392128';
              const announcementChannel = client.channels.cache.get(announcementChannelId);

              // Format the announcement message
              const announcement = `yener development\nAPP\n � ${new Date().toLocaleString()}\nAutomatic update from GitHub, pulling files.\n\n${pullStdout}`;

              // Send the announcement message to the specified channel
              if (announcementChannel) {
                announcementChannel.send(announcement);
              } else {
                console.error(`Announcement channel not found: ${announcementChannelId}`);
              }

              message.reply(`Pulled files from GitHub.`);
            });
          }
        });
      });
    } catch (err) {
      console.error(`An unexpected error occurred: ${err}`);
      message.reply('An unexpected error occurred. Please try again later.');
    }
  }
};
