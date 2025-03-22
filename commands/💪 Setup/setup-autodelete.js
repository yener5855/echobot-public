const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "setup-autodelete",
  category: "💪 Setup",
  aliases: ["setupautodelete", "autodelete-setup", "autodeletesetup"],
  cooldown: 5,
  usage: "setup-autodelete --> Follow the Steps",
  description: "Setup auto-deletion of messages in a specific channel after a specified time.",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");
    try {
      first_layer();
      async function first_layer() {
        let menuoptions = [
          {
            value: "Enable Auto-Delete",
            description: `Define the Auto-Delete Channel and Time`,
            emoji: "✅"
          },
          {
            value: "Disable Auto-Delete",
            description: `Disable the Auto-Delete`,
            emoji: "❌"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Auto-Delete`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Auto-Delete-Setup!`,
            emoji: "🛑"
          }
        ];
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Click me to setup the Auto-Delete System!')
          .addOptions(menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            };
            if (option.emoji) Obj.emoji = option.emoji;
            return Obj;
          }));

        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor('Auto-Delete Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/wastebasket_1f5d1.png', 'https://discord.com/invite/Yfb2fnkduE')
          .setDescription('Select an option to setup the Auto-Delete System.');

        let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] });
        const collector = menumsg.createMessageComponentCollector({ filter: i => i?.isSelectMenu() && i?.user && i?.user.id == cmduser.id, time: 90000 });

        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0]);
            if (menu?.values[0] == "Cancel") return menu?.reply("Cancelled the setup.");
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata);
          } else {
            menu?.reply({ content: "You are not allowed to do that!", ephemeral: true });
          }
        });

        collector.on('end', collected => {
          menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `Selected: ${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}` });
        });
      }

      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) {
          case "Enable Auto-Delete": {
            let tempmsg = await message.reply({ embeds: [new MessageEmbed().setTitle("Which channel should have auto-delete?").setColor(es.color).setDescription("Please mention the channel now!").setFooter(client.getFooter(es))] });
            await tempmsg.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 90000, errors: ["time"] })
              .then(async collected => {
                let channel = collected.first().mentions.channels.first() || message.guild.channels.cache.get(collected.first().content.trim().split(" ")[0]);
                if (channel) {
                  let tempmsg2 = await message.reply({ embeds: [new MessageEmbed().setTitle("After how many seconds should messages be deleted?").setColor(es.color).setDescription("Please provide the time in seconds.").setFooter(client.getFooter(es))] });
                  await tempmsg2.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time: 90000, errors: ["time"] })
                    .then(async collected2 => {
                      let time = parseInt(collected2.first().content.trim());
                      if (isNaN(time) || time <= 0) return message.reply("Invalid time provided.");
                      client.settings.set(message.guild.id, { channel: channel.id, time: time }, "autodelete");
                      return message.reply({ embeds: [new MessageEmbed().setTitle("Auto-Delete Enabled").setColor(es.color).setDescription(`Messages in <#${channel.id}> will be deleted after ${time} seconds.`).setFooter(client.getFooter(es))] });
                    }).catch(e => {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey);
                      return message.reply("Cancelled the operation.");
                    });
                } else {
                  return message.reply("No valid channel mentioned.");
                }
              }).catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                return message.reply("Cancelled the operation.");
              });
          }
          break;
          case "Disable Auto-Delete": {
            client.settings.set(message.guild.id, { channel: "", time: 0 }, "autodelete");
            return message.reply({ embeds: [new MessageEmbed().setTitle("Auto-Delete Disabled").setColor(es.color).setDescription("Auto-Delete has been disabled.").setFooter(client.getFooter(es))] });
          }
          break;
          case "Show Settings": {
            let settings = client.settings.get(message.guild.id, "autodelete");
            return message.reply({ embeds: [new MessageEmbed().setTitle("Auto-Delete Settings").setColor(es.color).setDescription(`**Channel:** ${settings.channel ? `<#${settings.channel}>` : "Not Set"}\n**Time:** ${settings.time ? `${settings.time} seconds` : "Not Set"}`).setFooter(client.getFooter(es))] });
          }
          break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return message.reply({ embeds: [new MessageEmbed().setColor(es.wrongcolor).setFooter(client.getFooter(es)).setTitle("An error occurred").setDescription(`\`\`\`${e.stack}\`\`\``)] });
    }
  },
};
