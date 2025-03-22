const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suggest',
  description: 'Manage suggestions (approve, deny, etc.)',
  usage: 'suggest <approve/deny/status/respond/resubmit/leaderboard> <message_id> [reason/status/response]',
  run: async (client, message, args) => {
    if (!args[0]) {
      return message.reply('❌ You must specify an action (approve, deny, etc.) and a message ID.');
    }

    const [action, messageId, ...reasonParts] = args;
    const reasonOrStatus = reasonParts.join(' ') || 'No reason provided.';
    const settings = client.settings.get(message.guild.id, 'suggest', { approvemsg: '✅ Approved!', denymsg: '❌ Denied!' });

    if (!['approve', 'deny', 'status', 'respond', 'resubmit', 'leaderboard'].includes(action)) {
      return message.reply('❌ Invalid action. Use `approve`, `deny`, `status`, `respond`, `resubmit`, or `leaderboard`.');
    }

    const channel = message.guild.channels.cache.get(settings.channel);
    if (!channel) {
      return message.reply('❌ Suggestion channel not found.');
    }

    // Fetch the message by ID
    const targetMessage = await channel.messages.fetch(messageId).catch(() => null);
    if (!targetMessage) {
      return message.reply('❌ Suggestion message not found. Please ensure the message ID is correct.');
    }

    // Ensure the target message is an embed with a valid format
    const embed = targetMessage.embeds[0];
    if (!embed) {
      return message.reply('❌ This message is not an embed. Please ensure it is a valid suggestion.');
    }

    // If the embed exists but doesn't have a title or the format is different, still allow action but warn
    if (!embed.title || !embed.title.includes('💡 New Suggestion')) {
      message.reply('⚠️ This message doesn’t seem like a standard suggestion, but the action will be processed.');
    }

    const suggestionData = client.settings.get(messageId);
    if (!suggestionData) {
      return message.reply('❌ Suggestion data not found. Please ensure the suggestion exists.');
    }

    // Handling actions
    if (action === 'approve' || action === 'deny') {
      embed.setColor(action === 'approve' ? '#32CD32' : '#FF4500') // Green for approve, OrangeRed for deny
        .setTitle(action === 'approve' ? '✅ Suggestion Approved' : '❌ Suggestion Denied')
        .addFields(
          { name: '👍 Upvotes', value: `${suggestionData.upvotes}`, inline: true },
          { name: '👎 Downvotes', value: `${suggestionData.downvotes}`, inline: true },
          { name: '📝 Reason', value: reasonOrStatus, inline: false }
        )
        .setFooter({ text: `Handled by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

      if (action === 'deny') {
        const user = await client.users.fetch(suggestionData.author).catch(() => null);
        if (user) {
          user.send(`❌ Your suggestion has been denied.\nReason: ${reasonOrStatus}`).catch(() => null);
        }
      }

      if (action === 'approve' && suggestionData.upvotes >= 50) {
        const pollMessage = await message.channel.send(`📊 **Community Poll**: Should this suggestion be implemented?\n👍 Yes\n👎 No`);
        await pollMessage.react('👍');
        await pollMessage.react('👎');
      }

      if (action === 'approve' && suggestionData.upvotes >= 10) {
        await targetMessage.pin().catch(() => null);
        message.channel.send('📌 This suggestion has been pinned due to high upvotes!');
      }

      const user = await client.users.fetch(suggestionData.author).catch(() => null);
      if (user) {
        user.send(`Your suggestion has been ${action}ed.\nReason: ${reasonOrStatus}`).catch(() => null);
      }
    } else if (action === 'status') {
      embed.addField('Current Status', reasonOrStatus, false);
    } else if (action === 'respond') {
      embed.addField('Staff Response', reasonOrStatus, false);
    } else if (action === 'resubmit') {
      if (suggestionData.status !== 'Rejected') {
        return message.reply('❌ Only rejected suggestions can be resubmitted.');
      }

      suggestionData.status = 'Pending';
      client.settings.set(messageId, suggestionData);

      embed.setColor('#1E90FF').addField('Status', 'Resubmitted', false);
      await targetMessage.edit({ embeds: [embed] });

      message.reply(`✅ Suggestion with ID ${messageId} has been resubmitted.`);
    } else if (action === 'leaderboard') {
      const leaderboardCount = client.settings.get(message.guild.id, 'suggest.leaderboardCount', 10);
      const suggestions = client.settings.get('globalSuggestions', []);
      const topUsers = suggestions
        .filter((s) => s.guildId === message.guild.id)
        .reduce((acc, s) => {
          acc[s.author] = (acc[s.author] || 0) + s.upvotes;
          return acc;
        }, {});

      const sortedUsers = Object.entries(topUsers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, leaderboardCount);

      const leaderboardEmbed = new MessageEmbed()
        .setTitle('🏆 Suggestion Leaderboard')
        .setDescription(
          sortedUsers
            .map(([userId, upvotes], index) => `**#${index + 1}** <@${userId}> - ${upvotes} upvotes`)
            .join('\n')
        )
        .setColor('#FFD700');

      return message.reply({ embeds: [leaderboardEmbed] });
    }

    await targetMessage.edit({ embeds: [embed] });

    message.reply(`✅ Suggestion ${action}ed successfully. Suggestion ID: ${messageId}`);
  },
};
