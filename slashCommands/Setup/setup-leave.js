const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-leave')
    .setDescription('Setup leave command'),
  async execute(interaction) {
    const cmduser = interaction.user;
    const client = interaction.client;

    async function first_layer() {
      // ...existing code...
      const menumsg = await interaction.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents([Selection])] });

      const collector = menumsg.createMessageComponentCollector({
        filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
        time: 90000,
      });

      collector.on('collect', menu => {
        if (menu?.user.id === cmduser.id) {
          collector.stop();
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
          if (menu?.values[0] == 'Cancel') return menu?.reply(eval(client.la[ls]['cmds']['setup']['setup-ticket']['variable3']));
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(' ')[0];
          handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata);
        } else {
          menu?.reply({ content: 'You are not allowed to do that! Only: <@${cmduser.id}>', ephemeral: true });
        }
      });

      collector.on('end', collected => {
        // ...existing code...
      });
    }

    first_layer();
  },
};
