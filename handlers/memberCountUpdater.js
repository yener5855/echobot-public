module.exports = (client) => {
  // Update member count channels every 5 seconds
  setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      updateMemberCountChannels(client, guild);
    });
  }, 5000); // 5 seconds

  client.on("guildMemberAdd", (member) => {
    updateMemberCountChannels(client, member.guild);
  });

  client.on("guildMemberRemove", (member) => {
    updateMemberCountChannels(client, member.guild);
  });
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
