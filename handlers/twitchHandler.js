const axios = require('axios');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../social_log/streamconfig.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function checkTwitchLive(client, channelName, discordChannelId) {
  try {
    const clientID = process.env.TWITCH_CLIENT_ID || config.twitch_clientID;
    const accessToken = process.env.TWITCH_AUTH_TOKEN || config.authToken;

    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
      headers: {
        'Client-ID': clientID,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.data.data.length > 0) {
      const stream = response.data.data[0];
      const embed = new Discord.MessageEmbed()
        .setTitle(`${stream.user_name} is live on Twitch!`)
        .setURL(`https://www.twitch.tv/${stream.user_name}`)
        .setDescription(stream.title)
        .setThumbnail(stream.thumbnail_url)
        .addField('Game', stream.game_name || 'Unknown', true)
        .addField('Viewers', stream.viewer_count.toString(), true)
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
