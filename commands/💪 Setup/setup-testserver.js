const { MessageEmbed, Permissions } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  name: "setup-testserver",
  category: "💪 Setup",
  aliases: ["testserver-setup", "setupserver"],
  cooldown: 5,
  usage: "setup-testserver",
  description: "Deletes all channels and roles, then sets up a test server with predefined structure.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      // Restrict to bot owner
      const botOwnerId = "809533218205466674"; // Use the provided bot owner ID
      if (message.author.id !== botOwnerId) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle("❌ You are not authorized to use this command.")
            .setFooter(client.getFooter(es))
          ]
        });
      }

      // Confirm the action
      const confirmMessage = await message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle("⚠️ Are you sure you want to delete all channels and roles, and set up a test server?")
          .setDescription("Type `yes` to confirm or `no` to cancel.")
          .setFooter(client.getFooter(es))
        ]
      });

      const filter = m => m.author.id === message.author.id && ["yes", "no"].includes(m.content.toLowerCase());
      const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });

      if (!collected.size || collected.first().content.toLowerCase() === "no") {
        return message.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setTitle("❌ Operation cancelled.")] });
      }

      // Delete all channels
      await message.guild.channels.cache.forEach(channel => channel.delete().catch(() => {}));

      // Delete all roles except @everyone
      await message.guild.roles.cache.forEach(role => {
        if (role.editable && role.name !== "@everyone") {
          role.delete().catch(() => {});
        }
      });

      // Create categories
      const textCategory = await message.guild.channels.create("Text Channels", { type: "GUILD_CATEGORY" });
      const voiceCategory = await message.guild.channels.create("Voice Channels", { type: "GUILD_CATEGORY" });

      // Create text channels with descriptive names
      const textChannels = ["general", "logs", "announcements", "rules", "test", "feedback"];
      for (const name of textChannels) {
        await message.guild.channels.create(name, { type: "GUILD_TEXT", parent: textCategory.id });
      }

      // Create voice channels with descriptive names
      const voiceChannels = ["General VC", "Gaming VC", "Music VC", "Study VC", "Test VC", "Chill VC"];
      for (const name of voiceChannels) {
        await message.guild.channels.create(name, { type: "GUILD_VOICE", parent: voiceCategory.id });
      }

      // Create roles with descriptive names
      const roles = [
        { name: "Admin", color: "RED", permissions: [Permissions.FLAGS.ADMINISTRATOR] },
        { name: "Moderator", color: "BLUE", permissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS] },
        { name: "Member", color: "GREEN", permissions: [] },
        { name: "Guest", color: "GREY", permissions: [] }
      ];
      for (const role of roles) {
        await message.guild.roles.create({
          name: role.name,
          color: role.color,
          permissions: role.permissions
        });
      }

      // Send success message
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle("✅ Test server setup complete!")
          .setDescription("All channels and roles have been deleted, and the test server structure has been created.")
          .setFooter(client.getFooter(es))
        ]
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle("❌ An error occurred while setting up the test server.")
          .setDescription(`\`\`\`${error.message}\`\`\``)
          .setFooter(client.getFooter(es))
        ]
      });
    }
  }
};
