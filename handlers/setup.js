const { MessageEmbed } = require('discord.js');

module.exports = (client) => {
    client.on('messageCreate', message => {
        if (message.content === '!setup') {
            message.guild.channels.create('welcome', { type: 'GUILD_TEXT' });
            message.guild.channels.create('suggestions', { type: 'GUILD_TEXT' });
            message.channel.send('Setup complete.');
        }
    });
};

module.exports.execute = async (message) => {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bot Setup')
        .setDescription('The bot has been successfully set up!')
        .setTimestamp();

    await message.channel.send({ embeds: [embed] });
};
