const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { STATUS_CODES } = require('http');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('httpstatus')
    .setDescription('Show HTTP status with a meme')
    .addStringOption(option => 
      option.setName('status')
        .setDescription('The HTTP status code')
        .setRequired(true)),
  async execute(interaction) {
    const status = interaction.options.getString('status');
    let es = ee;
    try {
      if (status !== "599" && !STATUS_CODES[status]) 
        return interaction.reply({ content: 'Invalid HTTP status code.' });

      const embed = new MessageEmbed()
        .setTitle(`HTTP Status ${status}`)
        .setImage(`https://http.cat/${status}.jpg`)
        .setDescription(status === "599" ? "Network Connect Timeout Error" : STATUS_CODES[status])
        .setColor(es.color);

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      await interaction.reply({ embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle('An error occurred')
        .setDescription('Could not fetch HTTP status information.')] });
    }
  }
};
