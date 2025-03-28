const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('esay')
    .setDescription('Resends your Text')
    .addStringOption(option => option.setName('text').setDescription('The text to send').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const es = interaction.client.settings.get(interaction.guild.id, 'embed');
    const ls = interaction.client.settings.get(interaction.guild.id, 'language');
    const adminroles = interaction.client.settings.get(interaction.guild.id, 'adminroles');
    const cmdroles = interaction.client.settings.get(interaction.guild.id, 'cmdadminroles.esay');
    const cmduser = interaction.user;

    if (([...interaction.member.roles.cache.values()] && !interaction.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(interaction.user.id) && ([...interaction.member.roles.cache.values()] && !interaction.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(interaction.guild.ownerId, config.ownerid).includes(interaction.user.id) && !interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle(eval(interaction.client.la[ls]['cmds']['administration']['esay']['variable1']))] });
    }

    if (!text) {
      return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle(eval(interaction.client.la[ls]['cmds']['administration']['esay']['variable3'])).setDescription(eval(interaction.client.la[ls]['cmds']['administration']['esay']['variable4']))] });
    }

    interaction.reply({ embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes('http://') || es.footericon.includes('https://')) ? es.footericon : interaction.client.user.displayAvatarURL() : null).setFooter(interaction.client.getFooter(es)).setDescription(text.substring(0, 2048))] });
  },
};
