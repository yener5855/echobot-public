const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const { databasing } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "automod",
  category: "🚫 Administration",
  aliases: ["automoderation", "automods"],
  cooldown: 5,
  usage: "automod",
  description: "Enable or disable specific auto moderation features using dropdown menus.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    const features = [
      "antispam", "antiselfbot", "antimention", "antilinks", "antidiscord",
      "anticaps", "blacklist", "ghost_ping_detector", "antiemoji", "antiflood",
      "antiprofanity", "antiphishing", "antimalware", "ratelimiting", "autowarnings",
      "autokick", "autoban", "wordreplacement", "rolemoderation", "mutesystem",
      "inactivitydetector", "botmonitoring", "antiscam", "antinudity", "advancedprofanityfilter",
      "antiimpersonation", "reputationsystem", "automatedreporting", "contentmoderation",
      "autothreadlocking", "aicontentanalysis", "autocorrect", "duplicatemessage", "antiadvertisement",
      "mediasizelimit", "voicechatmoderation", "messagecooldown", "georestrictions", "commandblacklist",
      "spamfilter", "autodeletion", "urlblacklisting", "customkeywords", "antiraid", "temporarybans",
      "mentionlimit", "emojiusagelimit", "verification", "newusermonitoring", "agerestriction",
      "invitelinkblocking", "offensiveusername", "ipblocking", "vpndetection", "reactionratelimit",
      "imagefilter", "autorole", "massmentionprevention", "joinleaveflood", "reactionspam",
      "linkwhitelisting", "antigore", "channelspecificrules", "antirepost", "commandabuse",
      "channellockdown", "antigambling", "adblacklist", "mutedrole", "pollmoderation",
      "multilanguagefilter", "messagefreezing", "doxxingprevention", "warningsystem",
      "autoroleremoval", "channelagerestrictions", "linkshortenerblocking", "serverlog",
      "dmfloodmonitoring", "phraseblacklist", "filetypeblocking", "antireactionbotting",
      "autoprune", "threadspam", "synonymsfilter", "spamattachments", "rolechannelaccess",
      "notificationspam", "messageapproval"
    ];

    // Helper function to split features into chunks of 25
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    const featureChunks = chunkArray(features, 25);
    const rows = featureChunks.map((chunk, index) => {
      return new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId(`automod-feature-select-${index}`)
          .setPlaceholder(`Select a feature (Menu ${index + 1})`)
          .addOptions(chunk.map(feature => ({
            label: feature,
            value: feature,
          })))
      );
    });

    // Add Enable All and Disable All buttons
    rows.push(
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('automod-enable-disable-all')
          .setPlaceholder('Enable/Disable All Features')
          .addOptions([
            { label: 'Enable All', value: 'enable_all' },
            { label: 'Disable All', value: 'disable_all' },
          ])
      )
    );

    const embed = new MessageEmbed()
      .setColor(es.color)
      .setFooter(client.getFooter(es))
      .setTitle("Automod Settings")
      .setDescription("Select a feature from the dropdown menus below to enable or disable it.");

    const msg = await message.reply({ embeds: [embed], components: rows });

    const filter = (interaction) =>
      interaction.isSelectMenu() &&
      (interaction.customId.startsWith('automod-feature-select') || interaction.customId === 'automod-enable-disable-all') &&
      interaction.user.id === message.author.id;

    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

    let interactionOccurred = false;

    collector.on('collect', async (interaction) => {
      interactionOccurred = true;

      if (interaction.customId === 'automod-enable-disable-all') {
        const action = interaction.values[0];
        const enable = action === 'enable_all';

        features.forEach(feature => {
          client.settings.set(message.guild.id, enable, `automod.${feature}`);
        });

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Automod Updated")
              .setDescription(`All features have been ${enable ? "enabled" : "disabled"}.`)
          ],
          ephemeral: true,
        });
      } else {
        const selectedFeature = interaction.values[0];
        const currentState = client.settings.get(message.guild.id, `automod.${selectedFeature}`) || false;

        client.settings.set(message.guild.id, !currentState, `automod.${selectedFeature}`);

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("Automod Updated")
              .setDescription(`The feature \`${selectedFeature}\` has been ${!currentState ? "enabled" : "disabled"}.`)
          ],
          ephemeral: true,
        });
      }
    });

    setTimeout(async () => {
      if (!interactionOccurred) {
        const enabledFeatures = features.filter(feature => client.settings.get(message.guild.id, `automod.${feature}`));
        
        const categorizedFeatures = enabledFeatures.reduce((categories, feature) => {
          const category = feature.includes("anti") ? "Anti Features" : "Other Features";
          if (!categories[category]) categories[category] = [];
          categories[category].push(feature);
          return categories;
        }, {});

        const description = Object.entries(categorizedFeatures)
          .map(([category, features]) => `**${category}**:\n${features.join(", ")}`)
          .join("\n\n");

        await message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle("No Selection Made")
              .setDescription(
                enabledFeatures.length > 0 
                  ? `Currently enabled features:\n\n${description}`
                  : "No features are currently enabled."
              )
          ]
        });
      }
    }, 10000);

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};
