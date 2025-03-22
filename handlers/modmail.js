const { MessageEmbed } = require('discord.js');
const { modmailChannelId } = require(`${process.cwd()}/botconfig/config.json`);

module.exports = client => {
    client.on('messageCreate', async message => {
        if (message.author.bot || message.channel.type !== 'DM') return;

        const modmailChannel = client.channels.cache.get(modmailChannelId);
        if (!modmailChannel) return console.error('Modmail channel not found.');

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)
            .setTimestamp();

        modmailChannel.send({ embeds: [embed] });
    });
};
