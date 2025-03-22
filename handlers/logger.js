const Discord = require("discord.js");
const fs = require("fs")
const moment = require('moment');
const chalk = require('chalk');

// Logging function with levels and colors
const log = (level, message, color) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(`\x1b[${color}m${logMessage}\x1b[0m`);
};

// Function to send ban appeal message
async function sendBanAppealMessage(user) {
    try {
        const appealMessage = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Ban Appeal")
            .setDescription("You have been banned from a server. If you believe this was a mistake, you can appeal your ban by visiting the following website:")
            .addField("Appeal Website", "https://your-appeal-website.com")
            .setFooter("Ban Appeal System");

        await user.send({ embeds: [appealMessage] });
    } catch (error) {
        console.error("Failed to send ban appeal message:", error);
    }
}

module.exports = (c) => {
    c.on("channelCreate", async function (channel) {
        log('INFO', `Channel CREATED: ${channel.name} (ID: ${channel.id})`, '32'); // Green
        send_log(c,
            channel.guild,
            "GREEN",
            "Channel CREATED",
            `**Channel:** \`${channel?.name}\`\n**ChannelID:** \`${channel.id}\`\n**ChannelTYPE:** \`${channel.type}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
        )
        return;
    })
    c.on("channelDelete", async function (channel) {
        log('WARN', `Channel DELETED: ${channel.name} (ID: ${channel.id})`, '31'); // Red
        send_log(c,
            channel.guild,
            "RED",
            "Channel DELETED",
            `**Channel:** \`${channel?.name}\`\n**ChannelID:** \`${channel.id}\`\n**ChannelTYPE:** \`${channel.type}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
    })
    c.on("channelPinsUpdate", async function (channel, time) {
        log('INFO', `Channel PINS UPDATE: ${channel.name} (ID: ${channel.id})`, '33'); // Yellow
        send_log(c,
            channel.guild,
            "YELLOW",
            "Channel PINS UPDATE",
            `Channel: \`${channel?.name}\`\nChannelID: \`${channel.id}\`\nPinned at \`${time}\``,
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png"
        )
        return;
    })
    c.on("channelUpdate", async function (oldChannel, newChannel) {
        if (oldChannel?.name != newChannel?.name) {
            log('INFO', `Channel UPDATED - NAME: ${oldChannel.name} (ID: ${oldChannel.id})`, '33'); // Yellow
            send_log(c,
                oldChannel.guild,
                "YELLOW",
                "Channel UPDATED - NAME",
                `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
                `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\``,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
            )
        } else if (oldChannel.type != newChannel.type) {
            log('INFO', `Channel UPDATED - TYPE: ${oldChannel.name} (ID: ${oldChannel.id})`, '33'); // Yellow
            send_log(c,
                oldChannel.guild,
                "YELLOW",
                "Channel UPDATED - TYPE",
                `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
                `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\``,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
            )
        } else if (oldChannel.topic != newChannel.topic) {
            log('INFO', `Channel UPDATED - TOPIC: ${oldChannel.name} (ID: ${oldChannel.id})`, '33'); // Yellow
            send_log(c,
                oldChannel.guild,
                "YELLOW",
                "Channel UPDATED - TOPIC",
                `**Channel:** \`${oldChannel?.name}\`\n**ChannelID**: \`${oldChannel.id}\`\n\n` +
                `**Channel:** \`${newChannel?.name}\`\n**ChannelID**: \`${newChannel.id}\`\n\n**ChannelTOPIC:** \`${newChannel.topic}\``,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
            )
        }
        return;
    })

    c.on("emojiCreate", async function (emoji) {
        log('INFO', `EMOJI CREATED: ${emoji.name} (ID: ${emoji.id})`, '32'); // Green
        send_log(c,
            emoji?.guild,
            "GREEN",
            "EMOJI CREATED",
            `EMOJI: ${emoji}\nEMOJINAME: ${emoji?.name}\nEMOJIID: ${emoji?.id}\nEMOJIURL: ${emoji?.url}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
        )
        return;
    });
    c.on("emojiDelete", async function (emoji) {
        log('WARN', `EMOJI DELETED: ${emoji.name} (ID: ${emoji.id})`, '31'); // Red
        send_log(c,
            emoji?.guild,
            "RED",
            "EMOJI DELETED",
            `EMOJI: ${emoji}\nEMOJINAME: ${emoji?.name}\nEMOJIID: ${emoji?.id}\nEMOJIURL: ${emoji?.url}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
    });
    c.on("emojiUpdate", async function (oldEmoji, newEmoji) {
        log('INFO', `EMOJI NAME CHANGED: ${oldEmoji.name} (ID: ${oldEmoji.id})`, '33'); // Yellow
        send_log(c,
            newEmoji?.guild,
            "ORANGE",
            "EMOJI NAME CHANGED",
            `__Emoji: ${newEmoji}__ \n\n**Before:** \`${oldEmoji?.name}\`\n**After:** \`${newEmoji?.name}\`\n**Emoji ID:** \`${newEmoji?.id}\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
        )
        return;
    });

    c.on("guildBanAdd", async function ({ guild, user }) {
        log('WARN', `USER BANNED: ${user.tag} (ID: ${user.id})`, '31'); // Red
        send_log(c,
            guild,
            "RED",
            "USER BANNED",
            `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
            user.displayAvatarURL({ dynamic: true })
        );

        // Send ban appeal message
        sendBanAppealMessage(user);

        return;
    });
    c.on("guildBanRemove", async function ({ guild, user }) {
        log('INFO', `USER UNBANNED: ${user.tag} (ID: ${user.id})`, '33'); // Yellow
        send_log(c,
            guild,
            "YELLOW",
            "USER UNBANNED",
            `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
            user.displayAvatarURL({ dynamic: true })
        )
        return;
    });

    c.on("guildMemberAdd", async function (member) {
        if (!member.user.bot) {
            log('INFO', `MEMBER JOINED: ${member.user.tag} (ID: ${member.user.id})`, '32'); // Green
            send_log(member.guild,
                c,
                "GREEN",
                "MEMBER JOINED",
                `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\`\n\n**Account created:** \`${moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\` | " + "`" + moment(member.user.createdTimestamp).format("hh:mm:ss")}`,
                member.user.displayAvatarURL({ dynamic: true })
            )
        } else {
            log('INFO', `BOT ADDED: ${member.user.tag} (ID: ${member.user.id})`, '33'); // Yellow
            send_log(c,
                member.guild,
                "ORANGE",
                "BOT ADDED",
                `**Bot:** ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\`\n\n**Bot created:** \`${moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\` | " + "`" + moment(member.user.createdTimestamp).format("hh:mm:ss")}`,
            )
            return;
        }
    });
    let banMap = new Map();
    //LEAVES
    c.on("guildMemberRemove", async function (member) {
        setTimeout(() => {
            if (banMap.has(member.id)) {
                banMap.delete(member.id)
                return;
            }
            log('INFO', `MEMBER LEFT: ${member.user.tag} (ID: ${member.user.id})`, '31'); // Red
            send_log(c,
                member.guild,
                "RED",
                "MEMBER LEFT",
                `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
                member.user.displayAvatarURL({
                    dynamic: true
                })
            )
        }, 500)
    });
    //BAN
    c.on("guildBanAdd", async function (ban) {
        //set it that it's a ban
        banMap.set(ban.user.id, true);
        log('WARN', `MEMBER GOT BANNED: ${ban.user.tag} (ID: ${ban.user.id})`, '31'); // Red
        send_log(c,
            ban.guild,
            "RED",
            "?? MEMBER GOT BANNED ??",
            `Member: ${ban.user} (\`${ban.user.id}\`)\n\`${ban.user.tag}\`\n\nReason: ${ban.reason ? ban.reason : "No Reason provided!"}`,
            ban.user.displayAvatarURL({
                dynamic: true
            })
        )
    });
    //UNBAN
    c.on("guildBanRemove", async function (ban) {
        //set it that it's a ban
        banMap.set(ban.user.id, true);
        log('INFO', `MEMBER GOT UNBANNED: ${ban.user.tag} (ID: ${ban.user.id})`, '33'); // Yellow
        send_log(c,
            ban.guild,
            "ORANGE",
            "? MEMBER GOT __UN__BANNED ?",
            `Member: ${ban.user} (\`${ban.user.id}\`)\n\`${ban.user.tag}\`\n\nReason was: ${ban.reason ? ban.reason : "No Reason provided!"}`,
            ban.user.displayAvatarURL({
                dynamic: true
            })
        )
    });
    c.on("guildMembersChunk", async function (members, guild, chunk) {
        log('INFO', `MEMBER CHUNK / RAID - [${members.size}] Members`, '33'); // Yellow
        send_log(guild,
            c,
            "RED",
            `MEMBER CHUNK / RAID - [${members.size}] Members`,
            members.size < 20 ? members.map((member, index) => `${index}) - ${member.user} - ${member.user.tag} - \`${member.user.id}\``).join("\n") : [...members.values()].slice(0, 20).map((member, index) => `${index}) - ${member.user} - ${member.user.tag} - \`${member.user.id}\`\n${members.size - 20} more...`).join("\n"),
        )
    });
    c.on("guildMemberUpdate", async function (oldMember, newMember) {
        let options = {}
        if (options[newMember.guild.id]) {
            options = options[newMember.guild.id]
        }
        // Add default empty list
        if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
        if (typeof options.trackroles === "undefined") options.trackroles = true
        const oldMemberRoles = [...oldMember.roles.cache.keys()];
        const newMemberRoles = [...newMember.roles.cache.keys()];
        const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
        const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))
        const rolechanged = (newRoles.length || oldRoles.length)
        if (rolechanged) {
            let roleadded = ""
            if (newRoles.length > 0) {
                for (let i = 0; i < newRoles.length; i++) {
                    if (i > 0) roleadded += ", "
                    roleadded += `<@&${newRoles[i]}>`
                }
            }
            let roleremoved = ""
            if (oldRoles.length > 0) {
                for (let i = 0; i < oldRoles.length; i++) {
                    if (i > 0) roleremoved += ", "
                    roleremoved += `<@&${oldRoles[i]}>`
                }
            }
            let text = `${roleremoved ? `? ROLE REMOVED: \n${roleremoved}` : ""}${roleadded ? `? ROLE ADDED:\n${roleadded}` : ""}`
            log('INFO', `Member ROLES Changed: ${newMember.user.tag} (ID: ${newMember.user.id})`, '33'); // Yellow
            send_log(c,
                oldMember.guild,
                `${roleadded ? "GREEN" : "RED"}`,
                "Member ROLES Changed",
                `Member: ${newMember.user}\nUser: \`${oldMember.user.tag}\`\n\n${text}`,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529692867289128/861357037064421386.png"
            )
        }
    });

    c.on("messageDelete", async function (message) {
        log('INFO', `Message Deleted: ${message.author.tag} (ID: ${message.author.id})`, '33'); // Yellow
        send_log(c,
            message.guild,
            "ORANGE",
            "Message Deleted",
            `**Author : ** <@${message.author?.id}> - *${message.author?.tag}*\n**Date : ** ${message.createdAt}\n**Channel : ** <#${message.channel?.id}> - *${message.channel?.name}*\n\n**Deleted Message : **\n\`\`\`\n${message.content?.replace(/`/g, "'").substring(0, 1800)}\n\`\`\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png",
            `**Attachment URL(s): **`, `>>> ${[...message.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`
        )
        return;
    });

    c.on("messageDeleteBulk", async function (messages) {
        log('INFO', `[${messages.size}] Messages Deleted BULK`, '31'); // Red
        send_log(c,
            messages.guild,
            "RED",
            `[${messages.size}] Messages Deleted BULK`,
            `${messages.size} Messages deleted in: ${messages.channel}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
    });

    c.on("messageUpdate", async function (oldMessage, newMessage) {
        if (oldMessage.author && oldMessage.author.bot) return;
        if (newMessage.author && newMessage.author.bot) return;
        if (oldMessage.channel.type !== "GUILD_TEXT") return
        if (newMessage.channel.type !== "GUILD_TEXT") return
        if (oldMessage.content === newMessage.content) return
        log('INFO', `Message UPDATED: ${newMessage.author.tag} (ID: ${newMessage.author.id})`, '33'); // Yellow
        send_log(c, oldMessage.guild,
            "YELLOW",
            "Message UPDATED",
            ` **Author:** <@${newMessage.author.id}> - *${newMessage.author.tag}*\n**Date:** ${newMessage.createdAt}\n**Channel:** <#${newMessage.channel?.id}> - *${newMessage.channel?.name}*\n**Orignal Message:**\n\`\`\`\n${oldMessage.content ? oldMessage.content.replace(/`/g, "'") : "UNKNOWN CONTENT"}\n\`\`\`\n**Updated Message :**\n\`\`\`\n${newMessage.content ? newMessage.content.replace(/`/g, "'") : "UNKNOWN CONTENT"}\n\`\`\``,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530575411773440/857128740198023190.png",
            `**Attachment BEFORE: URL(s): **`, `>>> ${[...newMessage.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`,
            `**Attachment AFTER: URL(s): **`, `>>> ${[...newMessage.attachments?.values()].map(x => x.proxyURL).join("\n\n")}`
        )
    });

    c.on("roleCreate", async function (role) {
        log('INFO', `ROLE CREATED: ${role.name} (ID: ${role.id})`, '32'); // Green
        send_log(c,
            role.guild,
            "GREEN",
            "ROLE CREATED",
            `ROLE: ${role}\nROLENAME: ${role?.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869531337411952670/845717716559593512.png"
        )
        return;
    });

    c.on("roleDelete", async function (role) {
        log('WARN', `ROLE DELETED: ${role.name} (ID: ${role.id})`, '31'); // Red
        send_log(c,
            role.guild,
            "RED",
            "ROLE DELETED",
            `ROLE: ${role}\nROLENAME: ${role?.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`,
            "https://cdn.discordapp.com/attachments/849047781276647425/869530655871082516/850923749132992550.png"
        )
        return;
    });

    c.on("roleUpdate", async function (oldRole, newRole) {
        if (oldRole?.name !== newRole?.name) {
            log('INFO', `ROLE NAME CHANGED: ${oldRole.name} (ID: ${oldRole.id})`, '33'); // Yellow
            send_log(c,
                oldRole.guild,
                "ORANGE",
                "ROLE NAME CHANGED",
                `__ROLE: ${newRole}__ \n\n**Before:** \`${oldRole.color.toString(16)}\`\n**After:** \`${newRole.color.toString(16)}\`\n**ROLE ID:** \`${newRole.id}\``
            )
        } else if (oldRole.color !== newRole.color) {
            log('INFO', `ROLE COLOR CHANGED: ${oldRole.name} (ID: ${oldRole.id})`, '33'); // Yellow
            send_log(c,
                oldRole.guild,
                "ORANGE",
                "ROLE COLOR CHANGED",
                `__ROLE: ${newRole}__ \n\n**Before:** \`${oldRole.color.toString(16)}\`\n**After:** \`${newRole.color.toString(16)}\`\n**ROLE ID:** \`${newRole.id}\``
            )
        }
        return;
    });
    c.on("voiceStateUpdate", (oldState, newState) => {
        if (!oldState.channelId && newState.channelId) {
            if (
                (!oldState.streaming && newState.streaming) ||
                (oldState.streaming && !newState.streaming) ||
                (!oldState.serverDeaf && newState.serverDeaf) ||
                (oldState.serverDeaf && !newState.serverDeaf) ||
                (!oldState.serverMute && newState.serverMute) ||
                (oldState.serverMute && !newState.serverMute) ||
                (!oldState.selfDeaf && newState.selfDeaf) ||
                (oldState.selfDeaf && !newState.selfDeaf) ||
                (!oldState.selfMute && newState.selfMute) ||
                (oldState.selfMute && !newState.selfMute) ||
                (!oldState.selfVideo && newState.selfVideo) ||
                (oldState.selfVideo && !newState.selfVideo)
            ) return;
            log('INFO', `CHANNEL JOINED: ${newState.member.user.tag} (ID: ${newState.member.user.id})`, '32'); // Green
            return send_log(c,
                newState.guild,
                "GREEN",
                "CHANNEL JOINED",
                `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nCHANNEL: <#${newState.channelId}> (\`${newState.channelId}\`)  ${newState.channel ? `(**${newState.channel?.name}**)` : ""}`,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529604296159282/863876115584385074.gif"
            )
        }
        if (oldState.channelId && !newState.channelId) {
            if (
                (!oldState.streaming && newState.streaming) ||
                (oldState.streaming && !newState.streaming) ||
                (!oldState.serverDeaf && newState.serverDeaf) ||
                (oldState.serverDeaf && !newState.serverDeaf) ||
                (!oldState.serverMute && newState.serverMute) ||
                (oldState.serverMute && !newState.serverMute) ||
                (!oldState.selfDeaf && newState.selfDeaf) ||
                (oldState.selfDeaf && !newState.selfDeaf) ||
                (!oldState.selfMute && newState.selfMute) ||
                (oldState.selfMute && !newState.selfMute) ||
                (!oldState.selfVideo && newState.selfVideo) ||
                (oldState.selfVideo && !newState.selfVideo)
            ) return;
            log('INFO', `CHANNEL LEFT: ${newState.member.user.tag} (ID: ${newState.member.user.id})`, '31'); // Red
            return send_log(c,
                newState.guild,
                "RED",
                "CHANNEL LEFT",
                `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nCHANNEL: <#${oldState.channelId}> (\`${oldState.channelId}\`) ${oldState.channel ? `(**${oldState.channel?.name}**)` : ""}`,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529603562172456/850830662897762324.png"
            )
        }
        if (oldState.channelId && newState.channelId) {
            if (
                (!oldState.streaming && newState.streaming) ||
                (oldState.streaming && !newState.streaming) ||
                (!oldState.serverDeaf && newState.serverDeaf) ||
                (oldState.serverDeaf && !newState.serverDeaf) ||
                (!oldState.serverMute && newState.serverMute) ||
                (oldState.serverMute && !newState.serverMute) ||
                (!oldState.selfDeaf && newState.selfDeaf) ||
                (oldState.selfDeaf && !newState.selfDeaf) ||
                (!oldState.selfMute && newState.selfMute) ||
                (oldState.selfMute && !newState.selfMute) ||
                (!oldState.selfVideo && newState.selfVideo) ||
                (oldState.selfVideo && !newState.selfVideo)
            ) return;
            log('INFO', `CHANNEL SWITCHED: ${newState.member.user.tag} (ID: ${newState.member.user.id})`, '32'); // Green
            return send_log(c,
                newState.guild,
                "GREEN",
                "CHANNEL SWITCHED",
                `**User:** <@${newState.member.user.id}> (\`${newState.member.user.id}\`) (**${newState.member.user.tag}**)\n\nTO CHANNEL: <#${newState.channelId}> (\`${newState.channelId}\`) ${newState.channel ? `(**${newState.channel?.name}**)` : ""}\n\nFROM CHANNEL: <#${oldState.channelId}> (\`${oldState.channelId}\`) ${oldState.channel ? `(**${oldState.channel?.name}**)` : ""}`,
                "https://cdn.discordapp.com/attachments/849047781276647425/869529684805840896/841989410978398218.gif"
            )
        }
    });

    c.on('error', error => {
        console.error(chalk.red.bold('ERROR:'), error);
    });

    c.on('warn', warning => {
        console.warn(chalk.yellow.bold('WARNING:'), warning);
    });

    c.on('disconnect', event => {
        console.log(chalk.magenta.bold('Node disconnected:'), event);
    });

    process.on('unhandledRejection', reason => {
        console.error(chalk.red.bold('=== UNHANDLED REJECTION ==='));
        console.error('Reason:', reason);
        console.error(chalk.red.bold('=== UNHANDLED REJECTION ==='));
    });

    process.on('uncaughtException', error => {
        console.error(chalk.red.bold('=== UNCAUGHT EXCEPTION ==='));
        console.error('Error:', error);
        console.error(chalk.red.bold('=== UNCAUGHT EXCEPTION ==='));
    });
}

async function send_log(c, guild, color, title, description, thumb, fieldt, fieldv, fieldt2, fieldv2) {
    try {
        if (!guild || guild?.available == false) return console.log("NO GUILD");
        //CREATE THE EMBED
        const LogEmbed = new Discord.MessageEmbed()
            .setColor(color ? color : "BLACK")
            .setDescription(description ? description.substring(0, 2048) : "\u200b")
            .setTitle(title ? title.substring(0, 256) : "\u200b")
            .setTimestamp()
            .setThumbnail(thumb ? thumb : guild?.iconURL({
                format: "png"
            }))
            .setFooter(c.getFooter(guild?.name + " | powered by: https://yener5855.is-local.org/", guild?.iconURL({
                format: "png"
            })))
        if (fieldt && fieldv) {
            if (fieldv.trim() !== ">>>") {
                LogEmbed.addField(fieldt.substring(0, 256), fieldv.substring(0, 1024))
            }
        }
        if (fieldt2 && fieldv2) {
            if (fieldv2.trim() !== ">>>") {
                LogEmbed.addField(fieldt2.substring(0, 256), fieldv2.substring(0, 1024))
            }
        }
        //GET THE CHANNEL
        let loggersettings = c.settings.get(guild.id, "logger")
        if (!loggersettings || loggersettings.channel === "no") return;
        const logger = await c.channels.fetch(loggersettings.channel).catch(() => {});
        if (!logger) throw new SyntaxError("CHANNEL NOT FOUND")
        return logger.send({ embeds: [LogEmbed] }).catch(() => {})
    } catch (e) {
    }
}
