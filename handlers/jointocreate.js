module.exports = (client) => {
  const deletionDelay = 10000; // Set deletion delay to 10 seconds

  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      const guild = newState.guild;
      const jointocreateChannelId = client.settings.get(guild.id, "jointocreate.channel");
      const channelNameFormat = client.settings.get(guild.id, "jointocreate.nameFormat") || "{user}'s Channel";

      if (!jointocreateChannelId) return;

      // User joins the Join-to-Create channel
      if (newState.channelId === jointocreateChannelId) {
        const user = newState.member;

        // Check if the user already has a temporary channel
        const existingChannelId = client.jointocreatemap.get(`tempvoicechannel_${guild.id}_${user.id}`);
        if (existingChannelId) {
          const existingChannel = guild.channels.cache.get(existingChannelId);
          if (existingChannel) return; // Do not create a new channel if one already exists
        }

        // Lock mechanism to prevent race conditions
        if (client.jointocreatemap.get(`creating_${guild.id}_${user.id}`)) return;
        client.jointocreatemap.set(`creating_${guild.id}_${user.id}`, true);

        const parent = newState.channel.parent;

        const createdChannel = await guild.channels.create(
          channelNameFormat.replace("{user}", user.user.username),
          {
            type: "GUILD_VOICE",
            parent: parent || null,
            permissionOverwrites: [
              {
                id: user.id,
                allow: ["MANAGE_CHANNELS", "CONNECT", "SPEAK"],
              },
              {
                id: guild.roles.everyone.id,
                allow: ["CONNECT"],
              },
            ],
          }
        );

        // Store the created channel in the map
        client.jointocreatemap.set(`tempvoicechannel_${guild.id}_${user.id}`, createdChannel.id);
        client.jointocreatemap.delete(`creating_${guild.id}_${user.id}`); // Unlock

        // Move the user to the created channel
        await user.voice.setChannel(createdChannel);
      }

      // User leaves a temporary channel
      if (oldState.channelId) {
        const tempChannelId = client.jointocreatemap.get(`tempvoicechannel_${guild.id}_${oldState.member.id}`);
        if (tempChannelId && oldState.channelId === tempChannelId) {
          const tempChannel = guild.channels.cache.get(tempChannelId);
          if (tempChannel && tempChannel.members.size === 0) {
            setTimeout(async () => {
              if (tempChannel.members.size === 0) {
                await tempChannel.delete().catch(() => {});
                client.jointocreatemap.delete(`tempvoicechannel_${guild.id}_${oldState.member.id}`); // Remove from map
              }
            }, deletionDelay); // Reduced delay to 10 seconds
          }
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  });
};
