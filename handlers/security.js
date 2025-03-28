const { MessageEmbed } = require('discord.js');
const config = require('../botconfig/config.json');
const { simple_databasing } = require('./functions'); // Import simple_databasing

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    if (message.content.startsWith(`${config.prefix}security`)) {
      const args = message.content.split(' ');
      const feature = args[1];
      const action = args[2];

      if (config.security[feature] !== undefined) {
        config.security[feature] = action === 'enable';
        message.channel.send(`Security feature ${feature} has been ${action}d.`);
      } else {
        message.channel.send(`Unknown security feature: ${feature}`);
      }
    }
  });

  client.on('channelCreate', async (channel) => {
    try {
      const guildId = channel.guild.id;
      simple_databasing(client, guildId); // Ensure databasing is handled
      antinuke_databasing(channel.guild.id); // Call the function to initialize Anti-Nuke data
      if (config.security.channelCreate) {
        // Anti Channel Create
        await channel.delete();
        logAction('Channel Create', channel.guild, `Channel ${channel.name} was created and deleted.`);
      }
    } catch (e) {
      console.error(e);
    }
  });

  client.on('channelDelete', async (channel) => {
    if (config.security.channelDelete) {
      // Anti Channel Delete
      logAction('Channel Delete', channel.guild, `Channel ${channel.name} was deleted.`);
    }
  });

  client.on('channelUpdate', async (oldChannel, newChannel) => {
    if (config.security.channelUpdate) {
      // Anti Channel Update
      await newChannel.edit(oldChannel);
      logAction('Channel Update', newChannel.guild, `Channel ${newChannel.name} was updated and reverted.`);
    }
  });

  client.on('roleCreate', async (role) => {
    if (config.security.roleCreate) {
      // Anti Role Create
      await role.delete();
      logAction('Role Create', role.guild, `Role ${role.name} was created and deleted.`);
    }
  });

  client.on('roleDelete', async (role) => {
    if (config.security.roleDelete) {
      // Anti Role Delete
      logAction('Role Delete', role.guild, `Role ${role.name} was deleted.`);
    }
  });

  client.on('roleUpdate', async (oldRole, newRole) => {
    if (config.security.roleUpdate) {
      // Anti Role Update
      await newRole.edit(oldRole);
      logAction('Role Update', newRole.guild, `Role ${newRole.name} was updated and reverted.`);
    }
  });

  client.on('guildMemberAdd', async (member) => {
    if (config.security.botAdd && member.user.bot) {
      // Anti Bot Add
      await member.kick();
      logAction('Bot Add', member.guild, `Bot ${member.user.tag} was added and kicked.`);
    }
    // Security Handler
    const role = member.guild.roles.cache.find(role => role.name === 'New Member');
    if (role) {
      member.roles.add(role);
    }
  });

  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (config.security.memberUpdate) {
      // Anti Member-Update (Roles, Nicknames)
      await newMember.edit(oldMember);
      logAction('Member Update', newMember.guild, `Member ${newMember.user.tag} was updated and reverted.`);
    }
  });

  client.on('guildBanAdd', async (guild, user) => {
    if (config.security.memberBan) {
      // Anti Members Ban
      await guild.members.unban(user);
      logAction('Member Ban', guild, `Member ${user.tag} was banned and unbanned.`);
    }
  });

  client.on('guildMemberRemove', async (member) => {
    if (config.security.memberKick) {
      // Anti Members Kick
      logAction('Member Kick', member.guild, `Member ${member.user.tag} was kicked.`);
    }
  });

  client.on('messageDelete', async (message) => {
    if (config.security.messageDelete) {
      // Anti Messages Delete
      logAction('Message Delete', message.guild, `Message by ${message.author.tag} was deleted.`);
    }
  });

  client.on('webhookUpdate', async (channel) => {
    if (config.security.webhookUpdate) {
      // Anti Webhook Create/Delete
      const webhooks = await channel.fetchWebhooks();
      webhooks.forEach(async (webhook) => {
        await webhook.delete();
        logAction('Webhook Update', channel.guild, `Webhook ${webhook.name} was deleted.`);
      });
    }
  });

  client.on('guildUpdate', async (oldGuild, newGuild) => {
    if (config.security.vanityUrlDelete) {
      // Anti Vanity Url Delete
      if (oldGuild.vanityURLCode && !newGuild.vanityURLCode) {
        await newGuild.setVanityURL(oldGuild.vanityURLCode);
        logAction('Vanity URL Delete', newGuild, `Vanity URL was deleted and reverted.`);
      }
    }
  });

  client.on('messageCreate', async (message) => {
    if (config.security.messageSpam && isSpam(message)) {
      // Anti Mass-Mention, Anti Mention-Spam, Anti Caps-Spam, Anti Toxic Chat, Anti Discord Links, Anti Website Links, Anti Chat Spam, Anti Chat Duplicates, Anti Commands Spam
      await message.delete();
      logAction('Message Spam', message.guild, `Message by ${message.author.tag} was deleted for spam.`);
    }
  });

  client.on("guildMemberRemove", async (member) => {
    try {
        if (AddedMember) {
            try {
                if (AddedMember.bannable && data.antideleteuser.punishment.member.ban.enabled && (
                    (data.antideleteuser.punishment.member.ban.neededdaycount > 0 && memberData.antideleteuser.filter(v => v - (Date.now() - 8640000000) > 0).length > data.antideleteuser.punishment.member.ban.neededdaycount) ||
                    (data.antideleteuser.punishment.member.ban.neededweekcount > 0 && memberData.antideleteuser.filter(v => v - (Date.now() - 7 * 8640000000) > 0).length > data.antideleteuser.punishment.member.ban.neededweekcount) ||
                    (data.antideleteuser.punishment.member.ban.neededmonthcount > 0 && memberData.antideleteuser.filter(v => v - (Date.now() - 30 * 8640000000) > 0).length > data.antideleteuser.punishment.member.ban.neededmonthcount) ||
                    (data.antideleteuser.punishment.member.ban.noeededalltimecount > 0 && memberData.antideleteuser.length > data.antideleteuser.punishment.member.ban.noeededalltimecount)
                )) {
                    AddedMember.ban({
                            reason: `Anti Ban - He/She banned: ${member.user.id} | ${member.user.tag}`
                        })
                        .then(member => {
                            if (data.all.logger && data.all.logger.length > 5) {
                                try {
                                    if (ch) {
                                        ch.send({embeds: [new MessageEmbed()
                                            .setColor("RED")
                                            .setAuthor(`ANTI BAN - Banned ${AddedMember.user.tag} for banning ${member.user.tag}`, "https://cdn.discordapp.com/attachments/820695790170275871/869665114373095514/811556437284749322.png")
                                            .setThumbnail(member.user.displayAvatarURL({
                                                dynamic: true
                                            }))
                                            .setDescription(eval(client.la[ls]["handlers"]["antinukejs"]["anti_nuke"]["variable51"]))
                                            .setFooter(client.getFooter("ID: " + AddedUserID, AddedMember.user.displayAvatarURL({
                                                dynamic: true
                                            })))
                                        ]}).catch(() => {})
                                    }
                                } catch (e) {
                                    console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER".dim.cyan, e.stack ? String(e.stack).grey.grey : String(e).grey.grey)
                                }
                            }
                            console.log(`ANTI Ban - Banned ${member.user.tag} | ${member.user.id}`)
                        })
                        .catch((e) => {
                            console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER".dim.cyan, e.stack ? String(e.stack).grey.grey : String(e).grey.grey)
                        });
                }
            } catch (e) {
                console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER".dim.cyan, e.stack ? String(e.stack).grey.grey : String(e).grey.grey)
            }
        }
    } catch (e) {
        console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER".dim.cyan, e.stack ? String(e.stack).grey.grey : String(e).grey.grey)
    }
  });

  client.on("channelCreate", async (channel) => {
    if (!channel.guild) return;
    simple_databasing(client, channel.guild.id)
    let ls = client.settings.get(channel.guild.id, "language")
    antinuke_databasing(channel.guild.id);
    let data = client.Anti_Nuke_System.get(channel.guild.id)
    if(!data || !data.all) return;
    if (data.all.quarantine && data.all.quarantine.length > 5) {
        try {
            let therole = channel.guild.roles.cache.get(data.all.quarantine);
            if (therole && therole.id) {
                try {
                    if(channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                        if (Array.isArray(channel.permissionOverwrites.cache)) {
                            channel.permissionOverwrites.edit(therole.id, {
                                VIEW_CHANNEL: false,
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                CONNECT: false,
                                SPEAK: false
                            });
                        }
                    }
                  } catch (e) {
                    console.log(String(e.stack).grey.red);
                  }
            }
        } catch (e) {
            console.log("ANTI-NUKE SYSTEM - ERROR-CATCHER".dim.cyan, e.stack ? String(e.stack).grey.grey : String(e).grey.grey)
        }
    }
  });

  function logAction(action, guild, description) {
    const logChannel = guild.channels.cache.find(channel => channel.name === config.logChannel);
    if (logChannel) {
      const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(action)
        .setDescription(description)
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }
  }

  function isSpam(message) {
    // Implement spam detection logic here
    return false;
  }

  // Define or import the antinuke_databasing function
  function antinuke_databasing(guildId) {
    // Ensure the Anti-Nuke system is initialized for the guild
    if (!client.Anti_Nuke_System.has(guildId)) {
      client.Anti_Nuke_System.set(guildId, {
        antibot: [],
        antichanneldelete: [],
        antikick: [],
        antideleteuser: [],
        anticreaterole: [],
        // Add other necessary properties here
      });
    }
  }
};
