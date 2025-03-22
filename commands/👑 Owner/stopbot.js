const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { databasing, isValidURL } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "stopbot",
  category: "Owner",
  aliases: ["botstop"],
  cooldown: 5,
  usage: "stopbot",
  type: "bot",
  description: "Stops the Bot, setting it OFFLINE",
  run: async (client, message, args) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    // Check if user is the bot owner
    if (!config.ownerIDS.includes(message.author.id)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("? You are not authorized to use this command!")
            .setDescription("Only the bot owner can stop the bot."),
        ],
      });
    }

    try {
      let clientapp = client.application ? await client.application.fetch().catch(() => null) : null;

      if (!clientapp) {
        console.error("Client application fetch failed.");
        return message.reply("?? Unable to fetch bot application details. Try again later.");
      }

      // Fetching owner details safely
      let ownerDetails;
      if (clientapp.owner) {
        ownerDetails = clientapp.owner.discriminator
          ? `Owner: ${clientapp.owner.tag}`
          : `Team: ${clientapp.owner.name}\n |-> Members: ${
              clientapp.owner.members ? clientapp.owner.members.map((uid) => uid.user.tag).join(", ") : "Unknown"
            }`;
      } else {
        ownerDetails = "? Could not fetch owner details.";
      }

      // Respond with bot details before shutting down
      await message.reply({
        content: `**<:no:1269533999014084683> THIS COMMAND IS DISABLED, go to discord.gg/yener and <#840332764603351101> to restart it!**\n\n> **Path:**\n\`\`\`yml\n${process.cwd()}\n\`\`\`\n> **Server:**\n\`\`\`yml\n${String(
          Object.values(require("os").networkInterfaces())
            .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family === `IPv4` && !i?.internal && i?.address || []), [])), [])
        ).split(".")[3]}\n\`\`\`\n> **Command:**\n\`\`\`yml\npm2 list | grep "${String(process.cwd().split("/").pop()).toLowerCase()}" --ignore-case\n\`\`\`\n> **Application Information:**\n\`\`\`yml\nLink: https://discord.com/developers/applications/${client.user.id}\nName: ${clientapp.name}\n${ownerDetails}\nIcon: ${clientapp.iconURL()}\nBot-Public: ${clientapp.botPublic ? "?" : "?"} (Inviteable)\n\`\`\`\n> **About me:**\n\`\`\`yml\n${clientapp.description || "? No description set!"}\n\`\`\``
      });

      // Stop the bot using PM2
      require("child_process").exec(`pm2 stop index.js echoBOT_${process.cwd().split(require("path").sep).pop()}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return message.reply("?? Failed to stop the bot. Check logs for details.");
        }
      });
    } catch (e) {
      console.error("Unexpected error in stopbot command:", e);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle("?? An error occurred!")
            .setDescription("Something went wrong while executing this command. Please check the logs."),
        ],
      });
    }
  },
};
