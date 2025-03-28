const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npmpkgsize')
    .setDescription('Search the NPM Registry for a package size information')
    .addStringOption(option => 
      option.setName('package')
        .setDescription('The name of the npm package')
        .setRequired(true)),
  async execute(interaction) {
    const name = interaction.options.getString('package');
    let es = ee;
    try {
      const { publishSize, installSize } = await fetch(`https://packagephobia.now.sh/api.json?p=${encodeURIComponent(name)}`)
        .then(res => res.json());

      if (!publishSize && !installSize) return interaction.reply({ content: 'No size information found for this package.' });

      const suffixes = ["Bytes", "KB", "MB", "GB"];
      function getBytes(bytes) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (!bytes && "0 Bytes") || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
      }

      const embed = new MessageEmbed()
        .setTitle(`Package Size Information for ${name}`)
        .setColor(es.color)
        .addField('Publish Size', getBytes(publishSize), true)
        .addField('Install Size', getBytes(installSize), true);

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      await interaction.reply({ embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle('An error occurred')
        .setDescription('Could not fetch npm package size information.')] });
    }
  }
};
