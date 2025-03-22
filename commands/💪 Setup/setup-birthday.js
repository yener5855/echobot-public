const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
  name: "setup-birthday",
  category: "💪 Setup",
  aliases: [""],
  cooldown: 5,
  usage: "setup-birthday  -->  Follow the Steps",
  description: "Setup the Birthday System",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");
    try {
      // Create birthday role
      let birthdayRole = await message.guild.roles.create({
        name: 'Birthday',
        color: 'BLUE',
        reason: 'Birthday role for birthday announcements',
      });

      // Create birthday channel
      let birthdayChannel = await message.guild.channels.create('🎂-birthdays', {
        type: 'GUILD_TEXT',
        topic: 'Birthday announcements',
        permissionOverwrites: [
          {
            id: message.guild.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
        ],
      });

      // Save the channel ID to the database
      client.settings.set(message.guild.id, birthdayChannel.id, 'birthdayChannel');

      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle("Birthday System Setup")
        .setDescription(`The Birthday System has been set up. Users can now set their birthdays using the \`${prefix}setbirthday YYYY-MM-DD\` command. Birthday announcements will be made in ${birthdayChannel}.`)
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable10"]))
      ]});
    }
  },
};
