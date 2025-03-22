const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-advertise')
    .setDescription('Setup advertise command'),
  async execute(interaction) {
    const cmduser = interaction.user;
    const client = interaction.client;

    async function first_layer() {
      const MenuEmbed = new MessageEmbed().setDescription('Select an option');
      const Selection = new MessageSelectMenu()
        .setCustomId('MenuSelection')
        .setPlaceholder('Select an option')
        .addOptions([
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Cancel', value: 'cancel' },
        ]);

      const menumsg = await interaction.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents([Selection])] });

      function menuselection(menu) {
        // ...existing code...
      }

      client.on('interactionCreate', (menu) => {
        if (menu?.message.id === menumsg.id) {
          if (menu?.user.id === cmduser.id) {
            if (used1) return menu?.reply({ content: 'You already selected something, this Selection is now disabled!', ephemeral: true });
            menuselection(menu);
          } else {
            menu?.reply({ content: 'You are not allowed to do that! Only: <@${cmduser.id}>', ephemeral: true });
          }
        }
      });
    }

    first_layer();
  },
};
