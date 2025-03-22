const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const { databasing } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "setup-jointocreate",
  category: "💪 Setup",
  aliases: ["setupjointocreate", "jointocreate-setup", "jointocreate"],
  cooldown: 5,
  usage: "setup-jointocreate --> Follow the Steps",
  description: "Setup a Join-to-Create voice channel system",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      let tempmsg = await message.reply({
        embeds: [new MessageEmbed()
          .setTitle("Setup Join-to-Create")
          .setColor(es.color)
          .setDescription("Please mention the voice channel you want to use as the Join-to-Create channel.\n\nYou can also customize the channel name format by typing it after the channel mention. Use `{user}` to include the user's name.\n\nExample: `#voice-channel {user}'s Room`")
          .setFooter(client.getFooter(es))]
      });

      await tempmsg.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        time: 60000,
        errors: ["time"]
      }).then(collected => {
        let input = collected.first().content.split(" ");
        let mentionedChannel = collected.first().mentions.channels.first() || message.guild.channels.cache.get(input[0]);
        let channelNameFormat = input.slice(1).join(" ") || "{user}'s Channel";

        if (!mentionedChannel || mentionedChannel.type !== "GUILD_VOICE") {
          return message.reply({
            embeds: [new MessageEmbed()
              .setTitle("Invalid Channel")
              .setColor(es.wrongcolor)
              .setDescription("You need to mention a valid voice channel.")
              .setFooter(client.getFooter(es))]
          });
        }

        client.settings.set(message.guild.id, mentionedChannel.id, "jointocreate.channel");
        client.settings.set(message.guild.id, channelNameFormat, "jointocreate.nameFormat");

        return message.reply({
          embeds: [new MessageEmbed()
            .setTitle("Join-to-Create Setup Complete")
            .setColor(es.color)
            .setDescription(`The Join-to-Create system is now set up with the channel: <#${mentionedChannel.id}>.\n\nChannel Name Format: \`${channelNameFormat}\``)
            .setFooter(client.getFooter(es))]
        });
      }).catch(e => {
        console.log(String(e.stack).grey.bgRed);
        return message.reply({
          embeds: [new MessageEmbed()
            .setTitle("Setup Cancelled")
            .setColor(es.wrongcolor)
            .setDescription("You did not provide a valid response in time.")
            .setFooter(client.getFooter(es))]
        });
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle("An error occurred")
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)]
      });
    }
  },
};
