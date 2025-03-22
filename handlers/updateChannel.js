const { MessageEmbed } = require('discord.js');

module.exports = (client) => {
  const channelId = '1326694427405717525'; // Replace with your channel ID

  async function updateChannel() {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.error('Channel not found');
        return;
      }

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Channel Update')
        .setDescription('This is an automated update every 5 minutes.')
        .setTimestamp();

      channel.send({ embeds: [embed] }).catch(console.error);
    } catch (error) {
      console.error('Error updating channel:', error);
    }
  }

  // Update the channel every 5 minutes (300000 milliseconds)
  setInterval(updateChannel, 300000);
};
