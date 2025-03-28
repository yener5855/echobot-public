const { CronJob } = require("cron");

module.exports = (client) => {
  const updateInterval = "0 */10 * * * *"; // Every 10 minutes

  const updateMemberCount = async (guildId, channelId) => {
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return;

      const channel = guild.channels.cache.get(channelId);
      if (!channel) return;

      const totalMembers = guild.memberCount;
      const newName = `Members: ${totalMembers}`;

      if (channel.name !== newName) {
        await channel.setName(newName);
        console.log(`Updated member count for ${guild.name} (${guildId}) in channel ${channel.name} (${channelId}).`);
      }
    } catch (error) {
      console.error(`Failed to update member count for guild ${guildId}:`, error);
    }
  };

  const job = new CronJob(updateInterval, async () => {
    const guildConfigs = client.settings.filter(config => config.memberCountChannel);
    for (const [guildId, config] of guildConfigs) {
      await updateMemberCount(guildId, config.memberCountChannel);
    }
  });

  client.on("ready", () => {
    console.log("Starting member count updater...");
    job.start();
  });
};
