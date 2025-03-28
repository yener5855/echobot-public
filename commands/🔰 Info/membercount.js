const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "Sets up live-updating member count channels.",
  category: "🔰 Info",
  usage: "membercount",
  run: async (client, message) => {
    try {
      // Ensure the bot has the necessary permissions
      if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
        return message.reply("I need the `Manage Channels` permission to set up member count channels.");
      }

      // Create or fetch the channels
      const totalChannel = await message.guild.channels.create("Total Members: 0", { type: "GUILD_VOICE", permissionOverwrites: [{ id: message.guild.id, deny: ["CONNECT"] }] });
      const humansChannel = await message.guild.channels.create("Humans: 0", { type: "GUILD_VOICE", permissionOverwrites: [{ id: message.guild.id, deny: ["CONNECT"] }] });
      const botsChannel = await message.guild.channels.create("Bots: 0", { type: "GUILD_VOICE", permissionOverwrites: [{ id: message.guild.id, deny: ["CONNECT"] }] });

      // Save the channel IDs in the bot's settings
      client.settings.set(message.guild.id, {
        totalChannelId: totalChannel.id,
        humansChannelId: humansChannel.id,
        botsChannelId: botsChannel.id,
      }, "memberCountChannels");

      // Update the channels immediately
      updateMemberCountChannels(client, message.guild);

      message.reply("Member count channels have been set up and will update automatically!");
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while setting up the member count channels.");
    }
  },
};

async function updateMemberCountChannels(client, guild) {
  try {
    const settings = client.settings.get(guild.id, "memberCountChannels");
    if (!settings) return;

    const totalMembers = guild.memberCount;
    const humanMembers = guild.members.cache.filter(member => !member.user.bot).size;
    const botMembers = guild.members.cache.filter(member => member.user.bot).size;

    const totalChannel = guild.channels.cache.get(settings.totalChannelId);
    const humansChannel = guild.channels.cache.get(settings.humansChannelId);
    const botsChannel = guild.channels.cache.get(settings.botsChannelId);

    if (totalChannel) await totalChannel.setName(`Total Members: ${totalMembers}`);
    if (humansChannel) await humansChannel.setName(`Humans: ${humanMembers}`);
    if (botsChannel) await botsChannel.setName(`Bots: ${botMembers}`);
  } catch (error) {
    console.error(`Failed to update member count channels for guild ${guild.id}:`, error);
  }
}
