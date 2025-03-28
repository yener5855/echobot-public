const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('View a GitHub Repository details')
    .addStringOption(option => 
      option.setName('repo')
        .setDescription('The GitHub repository link')
        .setRequired(true)),
  async execute(interaction) {
    const repo = interaction.options.getString('repo');
    let es = ee;
    try {
      const [base, username, repository] = repo.replace("https://", "").replace("http://", "").split("/");
      if (!username || !repository) 
        return interaction.reply({ embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle('Invalid Repository Link')
          .setDescription('Please provide a valid GitHub repository link.')] });

      const body = await fetch(`https://api.github.com/repos/${username}/${repository}`)
        .then((res) => res.ok && res.json())
        .catch(() => null);

      if (!body) 
        return interaction.reply({ embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle('Repository Not Found')
          .setDescription('Could not find the specified repository.')] });

      const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
      const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";
      const footer = [];
      if (body.fork) footer.push(`❯ **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
      if (body.archived) footer.push("❯ This repository is **Archived**");

      const embed = new MessageEmbed()
        .setTitle(body.full_name)
        .setAuthor('GitHub', 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')
        .setURL(body.html_url)
        .setThumbnail(body.owner.avatar_url)
        .setColor(es.color)
        .setDescription(body.description || "No Description.")
        .addField('Stars', body.stargazers_count.toString(), true)
        .addField('Forks', body.forks_count.toString(), true)
        .addField('Issues', body.open_issues_count.toString(), true)
        .addField('Language', body.language || "Unknown", true)
        .addField('License', license, true)
        .addField('Size', size, true)
        .addField('Default Branch', body.default_branch, true)
        .addField('Created At', new Date(body.created_at).toDateString(), true)
        .addField('Updated At', new Date(body.updated_at).toDateString(), true)
        .setFooter(footer.join("\n"));

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      await interaction.reply({ embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle('An error occurred')
        .setDescription('Could not fetch GitHub repository information.')] });
    }
  }
};
