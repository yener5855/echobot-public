const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the user to unban').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        try {
            await interaction.guild.members.unban(userId);
            return interaction.reply({ content: `User with ID ${userId} has been unbanned.`, ephemeral: true });
        } catch (error) {
            return interaction.reply({ content: 'User not found or not banned.', ephemeral: true });
        }
    },
};
