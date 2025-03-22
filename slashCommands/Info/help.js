const {
  MessageEmbed, MessageButton, MessageActionRow, Interaction
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration, handlemsg
} = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "help",
  description: "Returns all Commands, or one specific command",
  options: [
    {
      "StringChoices": {
        name: "category",
        description: "See the Commands of a Category",
        required: true,
        choices: [
          ["⌨️ Programming", "⌨️ Programming"],
          ["⚙️ Settings", "⚙️ Settings"],
          ["⚜️ Custom Queue(s)", "⚜️ Custom Queue(s)"],
          ["🎤 Voice", "🎤 Voice"],
          ["🎮 MiniGames", "🎮 MiniGames"],
          ["🎶 Music", "🎶 Music"],
          ["🏫 School Commands", "🏫 School Commands"],
          ["👀 Filter", "👀 Filter"],
          ["👑 Owner", "👑 Owner"],
          ["💪 Setup", "💪 Setup"],
          ["💸 Economy", "💸 Economy"],
          ["📈 Ranking", "📈 Ranking"],
          ["🔊 Soundboard", "🔊 Soundboard"],
          ["🔞 NSFW", "🔞 NSFW"],
          ["🔰 Info", "🔰 Info"],
          ["🕹️ Fun", "🕹️ Fun"],
          ["🚫 Administration", "🚫 Administration"],
        ]
      }
    },
    {
      "String": {
        name: "command",
        description: "Is there a specific Command you want details from?",
        required: false
      }
    }
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    const { member, options } = interaction;
    const { guild } = member;

    let CommandStr = options.getString("command");
    let Category = options.getString("category");

    if (!Category) {
      return interaction.reply({ content: "Please repeat but add a CATEGORY", ephemeral: true });
    }

    Category = Category.replace("_", " ");
    try {
      let allembeds = [];
      if (Category) {
        const cat = client.categories.find(cat => cat.toLowerCase().includes(Category.toLowerCase()));
        if (cat) {
          const items = client.commands.filter((cmd) => cmd.category === cat).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Commands in ${cat} category`)
            .setDescription(items.join(", "))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, { prefix: prefix }), client.user.displayAvatarURL());

          allembeds.push(embed);
        }
      }

      if (CommandStr) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(client.user.displayAvatarURL());
        const cmd = client.commands.get(CommandStr.toLowerCase()) || client.commands.get(client.aliases.get(CommandStr.toLowerCase()));

        if (!cmd) {
          const cat = client.categories.find(cat => cat.toLowerCase().includes(CommandStr.toLowerCase()));
          if (cat) {
            const items = client.commands.filter((cmd) => cmd.category === cat).map((cmd) => `\`${cmd.name}\``);
            const embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setTitle(`Commands in ${cat} category`)
              .setDescription(items.join(", "))
              .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, { prefix: prefix }), client.user.displayAvatarURL());

            allembeds.push(embed);
          } else {
            allembeds.push(embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, { command: CommandStr.toLowerCase() })));
          }
        } else {
          embed.setTitle(`Details of ${cmd.name}`)
            .addField("Name", `\`${cmd.name}\``)
            .addField("Description", `\`\`\`${cmd.description}\`\`\``)
            .addField("Cooldown", `\`\`\`${cmd.cooldown || 3} Seconds\`\`\``)
            .addField("Usage", `\`\`\`${prefix}${cmd.usage}\`\`\``)
            .setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), client.user.displayAvatarURL());

          if (cmd.aliases) {
            embed.addField("Aliases", `\`${cmd.aliases.join("`, `")}\``);
          }

          allembeds.push(embed);
        }
      }

      interaction.reply({ embeds: allembeds, ephemeral: true });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
    }
  }
};
