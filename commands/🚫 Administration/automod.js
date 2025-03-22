const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const { databasing } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "automod",
  category: "🚫 Administration",
  aliases: ["automoderation", "automods"],
  cooldown: 5,
  usage: "automod <enable/disable> <feature>",
  description: "Enable or disable various auto moderation features.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    if (!args[0] || !["enable", "disable"].includes(args[0].toLowerCase())) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle("Invalid Usage!")
          .setDescription("Usage: `automod <enable/disable> <feature>`\nFeatures: `antispam`, `antiselfbot`, `antimention`, `antilinks`, `antidiscord`, `anticaps`, `blacklist`, `ghost_ping_detector`")
        ]
      });
    }

    const feature = args[1]?.toLowerCase();
    if (!feature || !["antispam", "antiselfbot", "antimention", "antilinks", "antidiscord", "anticaps", "blacklist", "ghost_ping_detector"].includes(feature)) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle("Invalid Feature!")
          .setDescription("Features: `antispam`, `antiselfbot`, `antimention`, `antilinks`, `antidiscord`, `anticaps`, `blacklist`, `ghost_ping_detector`")
        ]
      });
    }

    const enable = args[0].toLowerCase() === "enable";
    client.settings.set(message.guild.id, enable, `autowarn.${feature}`);

    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setTitle(`Successfully ${enable ? "enabled" : "disabled"} ${feature}!`)
      ]
    });
  },
};
