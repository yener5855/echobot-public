const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const { exec } = require("child_process");
const fs = require("fs");
const { delay } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "reloadbot",
  category: "Owner",
  aliases: ["botreload"],
  cooldown: 5,
  type: "info",
  usage: "reloadbot",
  description: "Reloads all commands, events, and configurations.",
  run: async (client, message) => {
    let es = client.settings.get(message.guild.id, "embed");

    // Check if user is an owner
    if (!config.ownerIDS.includes(message.author.id)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("? You are not authorized to use this command!")
            .setDescription("Only the bot owner can reload the bot."),
        ],
      });
    }

    try {
      await message.reply("?? **Reloading bot...**");

      // Clear the command cache
      client.commands.clear();
      fs.readdirSync("./commands/").forEach((dir) => {
        fs.readdirSync(`./commands/${dir}/`)
          .filter((file) => file.endsWith(".js"))
          .forEach((file) => {
            try {
              delete require.cache[require.resolve(`../../commands/${dir}/${file}`)];
            } catch (err) {
              console.error(`Failed to reload: ${file}`, err);
            }
          });
      });

      // Wait for changes to take effect
      await delay(1000);

      // Remove all event listeners
      client.removeAllListeners();

      // Wait 1 more sec
      await delay(1000);

      // Stop active jobs safely
      const jobs = [
        "Joblivelog",
        "Joblivelog2",
        "Jobyoutube",
        "Jobtwitterfeed",
        "Jobtiktok",
        "Jobautonsfw",
        "Jobroster",
        "Jobroster2",
        "Jobroster3",
        "Jobmembercount",
        "JobJointocreate",
        "JobJointocreate2",
        "Jobdailyfact",
        "Jobmute",
      ];
      jobs.forEach((job) => {
        if (client[job]) client[job].stop();
      });

      // Reload bot using PM2 or exit process
      exec(`pm2 restart index.js`, (error) => {
        if (error) {
          console.error(`PM2 Restart Error: ${error}`);
          return message.reply("?? Failed to reload the bot.");
        }
      });

      // Alternative: Force restart if not using PM2
      setTimeout(() => {
        process.exit(1);
      }, 3000);

      await message.reply("? **Bot successfully reloaded!**");
    } catch (e) {
      console.error("Error reloading bot:", e);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("?? An error occurred!")
            .setDescription("Something went wrong while reloading the bot."),
        ],
      });
    }
  },
};
