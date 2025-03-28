const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npm')
    .setDescription('Search the NPM Registry for a package information')
    .addStringOption(option => 
      option.setName('package')
        .setDescription('The name of the npm package')
        .setRequired(true)),
  async execute(interaction) {
    const pkg = interaction.options.getString('package');
    let es = ee;
    try {
      const body = await fetch(`https://registry.npmjs.com/${pkg}`)
        .then((res) => {
          if (res.status === 404) throw "No results found.";
          return res.json();
        });

      const version = body.versions[body["dist-tags"].latest];
      let deps = version.dependencies ? Object.keys(version.dependencies) : null;
      let maintainers = body.maintainers.map((user) => user.name);

      if (maintainers.length > 10) {
        const len = maintainers.length - 10;
        maintainers = maintainers.slice(0, 10);
        maintainers.push(`...${len} more.`);
      }

      if (deps && deps.length > 10) {
        const len = deps.length - 10;
        deps = deps.slice(0, 10);
        deps.push(`...${len} more.`);
      }

      const embed = new MessageEmbed()
        .setTitle(body.name)
        .setColor(es.color)
        .setURL(`https://npmjs.com/package/${pkg}`)
        .setDescription(body.description || "No Description.")
        .addField('Version', body["dist-tags"].latest, true)
        .addField('License', body.license, true)
        .addField('Author', body.author ? body.author.name : "Unknown", true)
        .addField('Modified', new Date(body.time.modified).toDateString(), true)
        .addField('Dependencies', deps && deps.length ? deps.join(", ") : "None", true)
        .addField('Maintainers', maintainers.join(", "), true);

      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      await interaction.reply({ embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle('An error occurred')
        .setDescription('Could not fetch npm package information.')] });
    }
  }
};
