const { MessageEmbed } = require("discord.js");
const { GetUser, handlemsg } = require(`${process.cwd()}/handlers/functions`);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "emojiutil",
  aliases: ["emojitools"],
  category: "🔰 Info",
  description: "Various emoji utilities",
  usage: "emojiutil <enlarge|steal|addemoji> [args]",
  type: "utility",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    if (!args[0]) return message.reply(`Usage: \`${prefix}emojiutil <enlarge|steal|addemoji> [args]\``);

    switch (args[0].toLowerCase()) {
      case "enlarge":
        // ...existing code for enlarge...
        break;

      case "steal":
        if (!message.member.permissions.has("MANAGE_GUILD_EXPRESSIONS")) {
          return message.reply("You need the `Manage Guild Expressions` permission to use this command.");
        }
        if (args.length < 2) return message.reply("Usage: `emojiutil steal <emoji1> <emoji2> ...`");

        for (const emoji of args.slice(1)) {
          const match = emoji.match(/<a?:\w+:(\d+)>/);
          if (match) {
            const url = `https://cdn.discordapp.com/emojis/${match[1]}.png?v=1`;
            const name = emoji.match(/:(\w+):/)[1];
            message.guild.emojis.create(url, name).catch(console.error);
          }
        }
        message.reply("Emojis have been stolen and added to the server.");
        break;

      case "addemoji":
        if (!message.member.permissions.has("MANAGE_GUILD_EXPRESSIONS")) {
          return message.reply("You need the `Manage Guild Expressions` permission to use this command.");
        }
        if (args.length < 3) return message.reply("Usage: `emojiutil addemoji <url|emoji> <name>`");

        const url = args[1].match(/<a?:\w+:(\d+)>/) ? `https://cdn.discordapp.com/emojis/${args[1].match(/<a?:\w+:(\d+)>/)[1]}.png?v=1` : args[1];
        const name = args[2];
        message.guild.emojis.create(url, name).catch(console.error);
        message.reply(`Emoji \`${name}\` has been added to the server.`);
        break;

      default:
        message.reply(`Unknown subcommand: \`${args[0]}\``);
    }
  }
};
