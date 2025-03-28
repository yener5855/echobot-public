const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addbotchat')
    .setDescription('Enable a bot-only chat where the community is allowed to use commands')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set as bot-only chat').setRequired(true))
    .addStringOption(option => 
      option.setName('action')
        .setDescription('Choose an action: add, remove, list')
        .setRequired(true)
        .addChoice('add', 'add')
        .addChoice('remove', 'remove')
        .addChoice('list', 'list')
    ),
  async execute(interaction) {
    let es = interaction.client.settings.get(interaction.guild.id, "embed");
    let ls = interaction.client.settings.get(interaction.guild.id, "language");

    try {
      const action = interaction.options.getString('action');
      const channel = interaction.options.getChannel('channel');

      if (action === 'add') {
        if (!channel) {
          return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle('Please mention a valid channel!')] });
        }

        if (interaction.client.settings.get(interaction.guild.id, `botchannel`).includes(channel.id)) {
          return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle('This channel is already a bot-only chat!')] });
        }

        interaction.client.settings.push(interaction.guild.id, channel.id, `botchannel`);

        let leftb = ``;
        if (interaction.client.settings.get(interaction.guild.id, `botchannel`).join(``) === ``) leftb = `no Channels, aka all Channels are Bot Channels`;
        else
          for (let i = 0; i < interaction.client.settings.get(interaction.guild.id, `botchannel`).length; i++) {
            leftb += `<#` + interaction.client.settings.get(interaction.guild.id, `botchannel`)[i] + `> | `;
          }

        return interaction.reply({ embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : interaction.client.user.displayAvatarURL() : null).setFooter(interaction.client.getFooter(es)).setTitle('Successfully added the bot-only chat!').setDescription(leftb)] });
      } else if (action === 'remove') {
        if (!channel) {
          return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle('Please mention a valid channel!')] });
        }

        if (!interaction.client.settings.get(interaction.guild.id, `botchannel`).includes(channel.id)) {
          return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle('This channel is not a bot-only chat!')] });
        }

        interaction.client.settings.remove(interaction.guild.id, channel.id, `botchannel`);

        let leftb = ``;
        if (interaction.client.settings.get(interaction.guild.id, `botchannel`).join(``) === ``) leftb = `no Channels, aka all Channels are Bot Channels`;
        else
          for (let i = 0; i < interaction.client.settings.get(interaction.guild.id, `botchannel`).length; i++) {
            leftb += `<#` + interaction.client.settings.get(interaction.guild.id, `botchannel`)[i] + `> | `;
          }

        return interaction.reply({ embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : interaction.client.user.displayAvatarURL() : null).setFooter(interaction.client.getFooter(es)).setTitle('Successfully removed the bot-only chat!').setDescription(leftb)] });
      } else if (action === 'list') {
        let leftb = ``;
        if (interaction.client.settings.get(interaction.guild.id, `botchannel`).join(``) === ``) leftb = `no Channels, aka all Channels are Bot Channels`;
        else
          for (let i = 0; i < interaction.client.settings.get(interaction.guild.id, `botchannel`).length; i++) {
            leftb += `<#` + interaction.client.settings.get(interaction.guild.id, `botchannel`)[i] + `> | `;
          }

        return interaction.reply({ embeds: [new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : interaction.client.user.displayAvatarURL() : null).setFooter(interaction.client.getFooter(es)).setTitle('List of bot-only chats').setDescription(leftb)] });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return interaction.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(interaction.client.getFooter(es)).setTitle('An error occurred').setDescription('Please try again later.')] });
    }
  }
};
