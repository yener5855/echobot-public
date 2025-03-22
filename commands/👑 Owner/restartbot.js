const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const { exec } = require("child_process");

module.exports = {
  name: "restartbot",
  category: "Owner",
  aliases: ["botrestart"],
  cooldown: 5,
  usage: "restartbot",
  type: "bot",
  description: "Restarts the bot if it’s not working as intended.",
  run: async (client, message) => {
    let es = client.settings.get(message.guild.id, "embed");

    // Ensure only bot owners can restart
    if (!config.ownerIDS.includes(message.author.id)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("? You are not authorized to use this command!")
            .setDescription("Only the bot owner can restart the bot."),
        ],
      });
    }

    try {
      await message.reply("?? **Restarting bot...**");

      // Use PM2 to restart the bot
      exec(`pm2 restart index.js`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Exec error: ${error}`);
          return message.reply("?? Failed to restart the bot. Check logs for details.");
        }
      });

      // Graceful exit for other hosting environments
      setTimeout(() => {
        process.exit(1);
      }, 3000);
    } catch (e) {
      console.error("Error in restartbot command:", e);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("?? An error occurred!")
            .setDescription("Something went wrong while restarting the bot."),
        ],
      });
    }
  },
};
