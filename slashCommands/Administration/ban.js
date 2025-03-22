const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    category: 'administration',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(user.id);
        if (member) {
            await member.ban();
            return interaction.reply({ content: `${user.tag} has been banned.`, ephemeral: true });
        } else {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }
    },
};
