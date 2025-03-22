const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('channelunlock')
        .setDescription('Unlocks a channel'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const channel = interaction.channel;
        await channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true });
        return interaction.reply({ content: 'Channel unlocked.', ephemeral: true });
    },
};
