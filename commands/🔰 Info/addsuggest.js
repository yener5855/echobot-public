const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'addsuggest',
  description: 'Send a suggestion directly to the suggestion channel.',
  usage: 'addsuggest <suggestion>',
  run: async (client, message, args) => {
    const settings = client.settings.get(message.guild.id, 'suggest', {
      channel: '',
    });

    if (!settings.channel) {
      return message.reply('❌ Suggestion channel is not configured. Please contact an admin.');
    }

    const suggestionChannel = message.guild.channels.cache.get(settings.channel);
    if (!suggestionChannel) {
      return message.reply('❌ Suggestion channel not found. Please contact an admin.');
    }

    const suggestion = args.join(' ');
    if (!suggestion) {
      return message.reply('❌ Please provide a suggestion to send.');
    }

    const embed = new MessageEmbed()
      .setTitle('💡 New Suggestion')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setDescription(`**Suggestion:**\n${suggestion}`)
      .setColor('#00BFFF') // DeepSkyBlue color
      .setFooter({ text: `Suggestion by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    try {
      const sentMessage = await suggestionChannel.send({ embeds: [embed] });
      await sentMessage.react('👍');
      await sentMessage.react('👎');

      message.reply('✅ Your suggestion has been sent to the suggestion channel!');
    } catch (error) {
      console.error('Error sending suggestion:', error);
      message.reply('❌ An error occurred while sending your suggestion. Please try again later.');
    }
  },
};
