const axios = require('axios');
const Discord = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);

async function checkTwitchLive(client, channelName, discordChannelId) {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
      headers: {
        'Client-ID': config.twitchClientId,
        'Authorization': `Bearer ${config.twitchAccessToken}`
      }
    });

    if (response.data.data.length > 0) {
      const stream = response.data.data[0];
      const embed = new Discord.MessageEmbed()
        .setTitle(`${stream.user_name} is live on Twitch!`)
        .setURL(`https://www.twitch.tv/${stream.user_name}`)
        .setDescription(stream.title)
        .setThumbnail(stream.thumbnail_url)
        .addField('Game', stream.game_name, true)
        .addField('Viewers', stream.viewer_count, true)
        .setColor('PURPLE');

      const discordChannel = client.channels.cache.get(discordChannelId);
      if (discordChannel) {
        discordChannel.send({ embeds: [embed] });
      }
    }
  } catch (error) {
    console.error('Error checking Twitch live status:', error);
  }
}

module.exports = {
  checkTwitchLive
};
