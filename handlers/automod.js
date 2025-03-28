const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = "+"; // Updated prefix
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift()?.toLowerCase();

      // Remove button-related logic
      if (command === "automod") {
        return message.channel.send({
          content: "Automod settings can be managed using commands.",
        });
      }
      return; // Exit if a command was handled
    }

    const settings = client.settings.get(message.guild.id, "automod") || {};

    // Anti-Spam
    if (settings.antispam && message.content.split(" ").length > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Spam Triggered!")
          .setDescription(`${message.author}, please avoid spamming.`)
        ]
      });
    }

    // Anti-Selfbot
    if (settings.antiselfbot && message.embeds.length > 0) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Selfbot Triggered!")
          .setDescription(`${message.author}, self-botting is not allowed.`)
        ]
      });
    }

    // Anti-Mention
    if (settings.antimention && message.mentions.users.size > 3) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Mention Triggered!")
          .setDescription(`${message.author}, excessive mentions are not allowed.`)
        ]
      });
    }

    // Anti-Links
    if (settings.antilinks && /(https?:\/\/[^\s]+)/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Links Triggered!")
          .setDescription(`${message.author}, posting links is not allowed.`)
        ]
      });
    }

    // Anti-Discord Links
    if (settings.antidiscord && /discord\.gg\/[^\s]+/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Discord Links Triggered!")
          .setDescription(`${message.author}, sharing Discord invites is not allowed.`)
        ]
      });
    }

    // Anti-Caps
    if (settings.anticaps && message.content.replace(/[^A-Z]/g, "").length > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Caps Triggered!")
          .setDescription(`${message.author}, excessive capital letters are not allowed.`)
        ]
      });
    }

    // Anti-Emoji
    if (settings.antiemoji && (message.content.match(/<a?:\w+:\d+>/g) || []).length > 3) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Emoji Triggered!")
          .setDescription(`${message.author}, excessive emojis are not allowed.`)
        ]
      });
    }

    // Anti-Flood
    if (settings.antiflood) {
      const floodCache = client.floodCache || new Map();
      const userFlood = floodCache.get(message.author.id) || { count: 0, lastMessage: null };
      const now = Date.now();

      if (userFlood.lastMessage && now - userFlood.lastMessage < 2000) {
        userFlood.count += 1;
      } else {
        userFlood.count = 1;
      }

      userFlood.lastMessage = now;
      floodCache.set(message.author.id, userFlood);

      if (userFlood.count > 5) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Anti-Flood Triggered!")
            .setDescription(`${message.author}, please avoid flooding the chat.`)
          ]
        });
      }

      client.floodCache = floodCache;
    }

    // Anti-Profanity
    if (settings.antiprofanity) {
      const profanityList = client.settings.get(message.guild.id, "profanityList") || [];
      if (profanityList.some(word => message.content.toLowerCase().includes(word))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Anti-Profanity Triggered!")
            .setDescription(`${message.author}, your message contains prohibited language.`)
          ]
        });
      }
    }

    // Advanced Profanity Filter
    if (settings.advancedprofanityfilter) {
      const advancedProfanityList = client.settings.get(message.guild.id, "advancedProfanityList") || [];
      if (advancedProfanityList.some(word => message.content.toLowerCase().includes(word))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Advanced Profanity Filter Triggered!")
            .setDescription(`${message.author}, your message contains prohibited language.`)
          ]
        });
      }
    }

    // Anti-Impersonation
    if (settings.antiimpersonation && message.member.nickname?.toLowerCase().includes("admin")) {
      await message.member.setNickname("Impersonation Detected").catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Impersonation Triggered!")
          .setDescription(`${message.author}, impersonation is not allowed.`)
        ]
      });
    }

    // Reputation System
    if (settings.reputationsystem) {
      const reputation = client.settings.get(message.guild.id, `reputation.${message.author.id}`) || 0;
      client.settings.set(message.guild.id, reputation + 1, `reputation.${message.author.id}`);
    }

    // Automated Reporting System
    if (settings.automatedreporting) {
      const reportChannelId = client.settings.get(message.guild.id, "reportChannel");
      const reportChannel = message.guild.channels.cache.get(reportChannelId);
      if (reportChannel) {
        reportChannel.send({
          embeds: [new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Automated Report")
            .setDescription(`**User:** ${message.author}\n**Message:** ${message.content}`)
          ]
        });
      }
    }

    // Content Moderation by Category
    if (settings.contentmoderation) {
      const restrictedCategories = client.settings.get(message.guild.id, "restrictedCategories") || [];
      if (restrictedCategories.some(category => message.content.toLowerCase().includes(category))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Content Moderation Triggered!")
            .setDescription(`${message.author}, this content is not allowed.`)
          ]
        });
      }
    }

    // Auto Thread Locking
    if (settings.autothreadlocking && message.channel.isThread()) {
      await message.channel.setLocked(true).catch(() => {});
    }

    // AI-Based Content Analysis
    if (settings.aicontentanalysis) {
      const isInappropriate = await client.ai.analyzeContent(message.content);
      if (isInappropriate) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("AI Content Analysis Triggered!")
            .setDescription(`${message.author}, your message was flagged as inappropriate.`)
          ]
        });
      }
    }

    // Auto-Correct for Text Formatting
    if (settings.autocorrect) {
      const correctedContent = message.content.replace(/teh/g, "the").replace(/recieve/g, "receive");
      if (correctedContent !== message.content) {
        await message.delete().catch(() => {});
        return message.channel.send(`${message.author}: ${correctedContent}`);
      }
    }

    // Duplicate Message Detection
    if (settings.duplicatemessage) {
      const duplicateCache = client.duplicateCache || new Map();
      const userMessages = duplicateCache.get(message.author.id) || [];
      const now = Date.now();

      userMessages.push({ content: message.content, timestamp: now });
      duplicateCache.set(message.author.id, userMessages.filter(msg => now - msg.timestamp < 10000));

      if (userMessages.filter(msg => msg.content === message.content).length > 2) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Duplicate Message Detection Triggered!")
            .setDescription(`${message.author}, please avoid sending duplicate messages.`)
          ]
        });
      }

      client.duplicateCache = duplicateCache;
    }

    // Anti-Advertisement
    if (settings.antiadvertisement && /(buy now|free gift|click here)/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Advertisement Triggered!")
          .setDescription(`${message.author}, advertisements are not allowed.`)
        ]
      });
    }

    // Media File Size Limit
    if (settings.mediasizelimit && message.attachments.some(attachment => attachment.size > 5 * 1024 * 1024)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Media File Size Limit Triggered!")
          .setDescription(`${message.author}, your media file exceeds the size limit.`)
        ]
      });
    }

    // Voice Chat Moderation
    if (settings.voicechatmoderation && message.member.voice.channel) {
      const voiceChannel = message.member.voice.channel;
      if (voiceChannel.members.size > 10) {
        await voiceChannel.disconnect(message.member).catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Voice Chat Moderation Triggered!")
            .setDescription(`${message.author}, the voice channel is too crowded.`)
          ]
        });
      }
    }

    // Message Cooldown Between Users
    if (settings.messagecooldown) {
      const cooldownCache = client.cooldownCache || new Map();
      const lastMessageTime = cooldownCache.get(message.author.id) || 0;
      const now = Date.now();

      if (now - lastMessageTime < 5000) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Message Cooldown Triggered!")
            .setDescription(`${message.author}, please wait before sending another message.`)
          ]
        });
      }

      cooldownCache.set(message.author.id, now);
      client.cooldownCache = cooldownCache;
    }

    // Geo-Location Based Restrictions
    if (settings.georestrictions) {
      const restrictedRegions = client.settings.get(message.guild.id, "restrictedRegions") || [];
      const userRegion = client.getUserRegion(message.author.id); // Assume this function exists
      if (restrictedRegions.includes(userRegion)) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Geo-Location Restriction Triggered!")
            .setDescription(`${message.author}, your region is restricted from sending messages.`)
          ]
        });
      }
    }

    // User Blacklist from Commands
    if (settings.commandblacklist && client.settings.get(message.guild.id, `blacklistedUsers.${message.author.id}`)) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Command Blacklist Triggered!")
          .setDescription(`${message.author}, you are blacklisted from using commands.`)
        ]
      });
    }

    // Blacklist
    if (settings.blacklist) {
      const blacklist = client.settings.get(message.guild.id, "blacklist") || [];
      if (blacklist.some(word => message.content.toLowerCase().includes(word))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Blacklist Triggered!")
            .setDescription(`${message.author}, your message contains a blacklisted word.`)
          ]
        });
      }
    }

    // Ghost Ping Detector
    if (settings.ghost_ping_detector && message.mentions.users.size > 0) {
      setTimeout(async () => {
        if (message.deleted) {
          return message.channel.send({
            embeds: [new MessageEmbed()
              .setColor("RED")
              .setTitle("Ghost Ping Detected!")
              .setDescription(`${message.author} ghost pinged someone.`)
            ]
          });
        }
      }, 1000);
    }

    // Invite Link Filter
    if (settings.inviteLinkFilter && /discord\.gg\/[^\s]+/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Invite Link Filter Triggered!")
          .setDescription(`${message.author}, sharing Discord invites is not allowed.`)
        ]
      });
    }

    // Emoji Spam Filter
    if (settings.emojiSpamFilter && (message.content.match(/<a?:\w+:\d+>/g) || []).length > 5) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Emoji Spam Filter Triggered!")
          .setDescription(`${message.author}, excessive emojis are not allowed.`)
        ]
      });
    }

    // Caps Lock Filter
    if (settings.capsLockFilter && message.content.replace(/[^A-Z]/g, "").length > 15) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Caps Lock Filter Triggered!")
          .setDescription(`${message.author}, excessive capital letters are not allowed.`)
        ]
      });
    }

    // Mass Mention Filter
    if (settings.massMentionFilter && message.mentions.users.size > 5) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Mass Mention Filter Triggered!")
          .setDescription(`${message.author}, excessive mentions are not allowed.`)
        ]
      });
    }

    // Repeated Message Filter
    if (settings.repeatedMessageFilter) {
      const repeatedCache = client.repeatedCache || new Map();
      const userMessages = repeatedCache.get(message.author.id) || [];
      const now = Date.now();

      userMessages.push({ content: message.content, timestamp: now });
      repeatedCache.set(message.author.id, userMessages.filter(msg => now - msg.timestamp < 5000));

      if (userMessages.filter(msg => msg.content === message.content).length > 3) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Repeated Message Filter Triggered!")
            .setDescription(`${message.author}, spamming repeated messages is not allowed.`)
          ]
        });
      }

      client.repeatedCache = repeatedCache;
    }

    // Nickname Enforcement
    if (settings.nicknameEnforcement && /[^a-zA-Z0-9\s]/.test(message.member.nickname || message.author.username)) {
      try {
        await message.member.setNickname("Enforced Nickname").catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Nickname Enforcement Triggered!")
            .setDescription(`${message.author}, your nickname has been changed to comply with server rules.`)
          ]
        });
      } catch (err) {
        console.error(err);
      }
    }

    // Auto-Log Infractions
    if (settings.autoLogInfractions) {
      const logChannelId = client.settings.get(message.guild.id, "logChannel");
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({
          embeds: [new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Infraction Logged")
            .setDescription(`**User:** ${message.author}\n**Action:** Message Deleted\n**Reason:** Violation of server rules.`)
          ]
        });
      }
    }

    // Auto-Warn for Caps Spam
    if (settings.autoWarnCapsSpam && message.content.replace(/[^A-Z]/g, "").length > 20) {
      const warns = client.settings.get(message.guild.id, `warns.${message.author.id}`) || 0;
      client.settings.set(message.guild.id, warns + 1, `warns.${message.author.id}`);
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("ORANGE")
          .setTitle("Auto-Warn Triggered!")
          .setDescription(`${message.author}, you have been warned for excessive caps usage.`)
        ]
      });
    }

    // Auto-Kick for Inactivity
    if (settings.autoKickInactivity) {
      const inactiveUsers = message.guild.members.cache.filter(member => {
        const lastMessage = member.lastMessage?.createdTimestamp || 0;
        return Date.now() - lastMessage > 30 * 24 * 60 * 60 * 1000; // 30 days
      });

      inactiveUsers.forEach(async (member) => {
        try {
          await member.kick("Inactive for 30 days").catch(() => {});
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Shadowban
    if (settings.shadowban && client.shadowbanList?.includes(message.author.id)) {
      await message.delete().catch(() => {});
    }

    // Auto-Assign Penalty Roles
    if (settings.autoAssignPenaltyRoles) {
      const penaltyRoleId = client.settings.get(message.guild.id, "penaltyRole");
      const penaltyRole = message.guild.roles.cache.get(penaltyRoleId);
      if (penaltyRole && !message.member.roles.cache.has(penaltyRoleId)) {
        await message.member.roles.add(penaltyRole).catch(() => {});
      }
    }

    // Auto-Unmute After Timeout
    if (settings.autoUnmuteAfterTimeout) {
      const timeoutCache = client.timeoutCache || new Map();
      const timeoutInfo = timeoutCache.get(message.author.id);

      if (timeoutInfo && Date.now() > timeoutInfo.expiresAt) {
        const mutedRoleId = client.settings.get(message.guild.id, "mutedRole");
        const mutedRole = message.guild.roles.cache.get(mutedRoleId);
        if (mutedRole) {
          await message.member.roles.remove(mutedRole).catch(() => {});
        }
        timeoutCache.delete(message.author.id);
      }

      client.timeoutCache = timeoutCache;
    }

    // Anti-Phishing
    if (settings.antiphishing && /phishing-link-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Phishing Triggered!")
          .setDescription(`${message.author}, phishing links are not allowed.`)
        ]
      });
    }

    // Anti-Malware Links
    if (settings.antimalware && /malware-link-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Malware Triggered!")
          .setDescription(`${message.author}, malware links are not allowed.`)
        ]
      });
    }

    // Rate Limiting
    if (settings.ratelimiting) {
      const rateCache = client.rateCache || new Map();
      const userRate = rateCache.get(message.author.id) || { count: 0, lastMessage: null };
      const now = Date.now();

      if (userRate.lastMessage && now - userRate.lastMessage < 1000) {
        userRate.count += 1;
      } else {
        userRate.count = 1;
      }

      userRate.lastMessage = now;
      rateCache.set(message.author.id, userRate);

      if (userRate.count > 10) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Rate Limiting Triggered!")
            .setDescription(`${message.author}, you are sending messages too quickly.`)
          ]
        });
      }

      client.rateCache = rateCache;
    }

    // Auto-Warnings
    if (settings.autowarnings) {
      const warns = client.settings.get(message.guild.id, `warns.${message.author.id}`) || 0;
      client.settings.set(message.guild.id, warns + 1, `warns.${message.author.id}`);
      if (warns + 1 >= 3) {
        await message.member.kick("Reached warning limit").catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("Auto-Warning Triggered!")
            .setDescription(`${message.author}, you have been kicked for reaching the warning limit.`)
          ]
        });
      }
    }

    // Auto-Kick/Ban System
    if (settings.autokick && message.member.kickable) {
      await message.member.kick("Auto-Kick Triggered").catch(() => {});
    }
    if (settings.autoban && message.member.bannable) {
      await message.member.ban({ reason: "Auto-Ban Triggered" }).catch(() => {});
    }

    // Word Replacement
    if (settings.wordreplacement) {
      const replacements = client.settings.get(message.guild.id, "replacements") || {};
      let newContent = message.content;
      for (const [word, replacement] of Object.entries(replacements)) {
        newContent = newContent.replace(new RegExp(word, "gi"), replacement);
      }
      if (newContent !== message.content) {
        await message.delete().catch(() => {});
        return message.channel.send(`${message.author}: ${newContent}`);
      }
    }

    // Role-Based Moderation
    if (settings.rolemoderation) {
      const restrictedRoles = client.settings.get(message.guild.id, "restrictedRoles") || [];
      if (restrictedRoles.some(role => message.member.roles.cache.has(role))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Role-Based Moderation Triggered!")
            .setDescription(`${message.author}, your role does not allow this action.`)
          ]
        });
      }
    }

    // Mute System
    if (settings.mutesystem && message.member.roles.cache.has(client.settings.get(message.guild.id, "mutedRole"))) {
      await message.delete().catch(() => {});
    }

    // Inactivity Detector
    if (settings.inactivitydetector) {
      const inactiveUsers = message.guild.members.cache.filter(member => {
        const lastMessage = member.lastMessage?.createdTimestamp || 0;
        return Date.now() - lastMessage > 30 * 24 * 60 * 60 * 1000; // 30 days
      });

      inactiveUsers.forEach(async (member) => {
        try {
          await member.kick("Inactive for 30 days").catch(() => {});
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Bot Behavior Monitoring
    if (settings.botmonitoring && message.author.bot) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Bot Behavior Monitoring Triggered!")
          .setDescription(`Bots are not allowed to send messages here.`)
        ]
      });
    }

    // Anti-Scam
    if (settings.antiscam && /scam-link-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Scam Triggered!")
          .setDescription(`${message.author}, scam links are not allowed.`)
        ]
      });
    }

    // Anti-Nudity
    if (settings.antinudity && /nudity-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Nudity Triggered!")
          .setDescription(`${message.author}, inappropriate content is not allowed.`)
        ]
      });
    }

    // Spam Filter
    if (settings.spamfilter && message.content.split(" ").length > 20) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Spam Filter Triggered!")
          .setDescription(`${message.author}, please avoid spamming.`)
        ]
      });
    }

    // Auto Message Deletion
    if (settings.autodeletion && message.channel.id === client.settings.get(message.guild.id, "autoDeleteChannel")) {
      setTimeout(() => message.delete().catch(() => {}), 5000); // Deletes after 5 seconds
    }

    // URL Blacklisting
    if (settings.urlblacklisting) {
      const blacklistedUrls = client.settings.get(message.guild.id, "blacklistedUrls") || [];
      if (blacklistedUrls.some(url => message.content.includes(url))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("URL Blacklisting Triggered!")
            .setDescription(`${message.author}, this URL is not allowed.`)
          ]
        });
      }
    }

    // Custom Keyword Detection
    if (settings.customkeywords) {
      const keywords = client.settings.get(message.guild.id, "customKeywords") || [];
      if (keywords.some(keyword => message.content.toLowerCase().includes(keyword))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Custom Keyword Detection Triggered!")
            .setDescription(`${message.author}, your message contains a restricted keyword.`)
          ]
        });
      }
    }

    // Anti-Raid Protection
    if (settings.antiraid && message.guild.memberCount > 1000 && message.mentions.users.size > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Raid Protection Triggered!")
          .setDescription(`${message.author}, mass mentions are not allowed.`)
        ]
      });
    }

    // Temporary Bans
    if (settings.temporarybans) {
      const tempBanDuration = client.settings.get(message.guild.id, "tempBanDuration") || 3600; // Default 1 hour
      if (message.member.bannable) {
        await message.member.ban({ reason: "Temporary Ban Triggered" }).catch(() => {});
        setTimeout(() => {
          message.guild.members.unban(message.author.id).catch(() => {});
        }, tempBanDuration * 1000);
      }
    }

    // Mention Limit
    if (settings.mentionlimit && message.mentions.users.size > 5) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Mention Limit Triggered!")
          .setDescription(`${message.author}, excessive mentions are not allowed.`)
        ]
      });
    }

    // Emoji Usage Limit
    if (settings.emojiusagelimit && (message.content.match(/<a?:\w+:\d+>/g) || []).length > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Emoji Usage Limit Triggered!")
          .setDescription(`${message.author}, excessive emoji usage is not allowed.`)
        ]
      });
    }

    // User Verification System
    if (settings.verification && !message.member.roles.cache.has(client.settings.get(message.guild.id, "verifiedRole"))) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Verification Required!")
          .setDescription(`${message.author}, you must verify your account to participate.`)
        ]
      });
    }

    // New User Monitoring
    if (settings.newusermonitoring && Date.now() - message.member.joinedTimestamp < 24 * 60 * 60 * 1000) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("New User Monitoring Triggered!")
          .setDescription(`${message.author}, new users are restricted from certain actions.`)
        ]
      });
    }

    // Age Restriction Filter
    if (settings.agerestriction && message.member.roles.cache.has(client.settings.get(message.guild.id, "ageRestrictedRole"))) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Age Restriction Triggered!")
          .setDescription(`${message.author}, this content is restricted based on age.`)
        ]
      });
    }

    // Invite Link Blocking
    if (settings.invitelinkblocking && /discord\.gg\/[^\s]+/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Invite Link Blocking Triggered!")
          .setDescription(`${message.author}, sharing invite links is not allowed.`)
        ]
      });
    }

    // Offensive Username Filter
    if (settings.offensiveusername && /offensive-pattern/gi.test(message.member.displayName)) {
      try {
        await message.member.setNickname("Filtered Username").catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Offensive Username Filter Triggered!")
            .setDescription(`${message.author}, your username has been changed to comply with server rules.`)
          ]
        });
      } catch (err) {
        console.error(err);
      }
    }

    // IP Address Blocking
    if (settings.ipblocking && /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("IP Address Blocking Triggered!")
          .setDescription(`${message.author}, sharing IP addresses is not allowed.`)
        ]
      });
    }

    // VPN/Proxy Detection
    if (settings.vpndetection && client.isUsingVPN(message.author.id)) { // Assume `isUsingVPN` is implemented
      await message.member.kick("VPN/Proxy usage detected").catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("VPN/Proxy Detection Triggered!")
          .setDescription(`${message.author}, VPN/Proxy usage is not allowed.`)
        ]
      });
    }

    // Rate Limit on Reactions
    if (settings.reactionratelimit) {
      const reactionCache = client.reactionCache || new Map();
      const userReactions = reactionCache.get(message.author.id) || { count: 0, lastReaction: null };
      const now = Date.now();

      if (userReactions.lastReaction && now - userReactions.lastReaction < 1000) {
        userReactions.count += 1;
      } else {
        userReactions.count = 1;
      }

      userReactions.lastReaction = now;
      reactionCache.set(message.author.id, userReactions);

      if (userReactions.count > 5) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Reaction Rate Limit Triggered!")
            .setDescription(`${message.author}, you are reacting too quickly.`)
          ]
        });
      }

      client.reactionCache = reactionCache;
    }

    // Image Content Filter
    if (settings.imagefilter && message.attachments.some(attachment => attachment.contentType?.startsWith("image"))) {
      const isInappropriate = await client.ai.analyzeImage(attachment.url); // Assume `analyzeImage` is implemented
      if (isInappropriate) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Image Content Filter Triggered!")
            .setDescription(`${message.author}, your image was flagged as inappropriate.`)
          ]
        });
      }
    }

    // Auto Role Assignment on Join
    if (settings.autorole) {
      const autoRoleId = client.settings.get(message.guild.id, "autoRole");
      const autoRole = message.guild.roles.cache.get(autoRoleId);
      if (autoRole && !message.member.roles.cache.has(autoRoleId)) {
        await message.member.roles.add(autoRole).catch(() => {});
      }
    }

    // Mass Mention Prevention
    if (settings.massmentionprevention && message.mentions.users.size > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Mass Mention Prevention Triggered!")
          .setDescription(`${message.author}, mass mentions are not allowed.`)
        ]
      });
    }

    // Join/Leave Flood Protection
    if (settings.joinleaveflood) {
      const joinLeaveCache = client.joinLeaveCache || new Map();
      const now = Date.now();

      joinLeaveCache.set(message.author.id, now);
      const recentJoins = Array.from(joinLeaveCache.values()).filter(timestamp => now - timestamp < 60000); // 1 minute
      if (recentJoins.length > 10) {
        await message.member.kick("Join/Leave flood detected").catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Join/Leave Flood Protection Triggered!")
            .setDescription(`${message.author}, join/leave flooding is not allowed.`)
          ]
        });
      }

      client.joinLeaveCache = joinLeaveCache;
    }

    // Reaction Spam Prevention
    if (settings.reactionspam && message.reactions.cache.size > 10) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Reaction Spam Prevention Triggered!")
          .setDescription(`${message.author}, excessive reactions are not allowed.`)
        ]
      });
    }

    // Link Whitelisting
    if (settings.linkwhitelisting) {
      const whitelistedLinks = client.settings.get(message.guild.id, "whitelistedLinks") || [];
      if (!whitelistedLinks.some(link => message.content.includes(link)) && /(https?:\/\/[^\s]+)/gi.test(message.content)) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Link Whitelisting Triggered!")
            .setDescription(`${message.author}, only whitelisted links are allowed.`)
          ]
        });
      }
    }

    // Anti-Gore Filter
    if (settings.antigore && /gore-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Gore Filter Triggered!")
          .setDescription(`${message.author}, gore content is not allowed.`)
        ]
      });
    }

    // Channel-Specific Moderation Rules
    if (settings.channelspecificrules) {
      const channelRules = client.settings.get(message.guild.id, `channelRules.${message.channel.id}`) || {};
      if (channelRules.noLinks && /(https?:\/\/[^\s]+)/gi.test(message.content)) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Channel-Specific Rules Triggered!")
            .setDescription(`${message.author}, links are not allowed in this channel.`)
          ]
        });
      }
    }

    // Anti-Repost
    if (settings.antirepost) {
      const repostCache = client.repostCache || new Map();
      const now = Date.now();

      if (repostCache.has(message.content)) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Anti-Repost Triggered!")
            .setDescription(`${message.author}, reposting content is not allowed.`)
          ]
        });
      }

      repostCache.set(message.content, now);
      client.repostCache = repostCache;
    }

    // Command Abuse Detection
    if (settings.commandabuse && message.content.startsWith(client.prefix)) {
      const commandCache = client.commandCache || new Map();
      const userCommands = commandCache.get(message.author.id) || { count: 0, lastCommand: null };
      const now = Date.now();

      if (userCommands.lastCommand && now - userCommands.lastCommand < 5000) {
        userCommands.count += 1;
      } else {
        userCommands.count = 1;
      }

      userCommands.lastCommand = now;
      commandCache.set(message.author.id, userCommands);

      if (userCommands.count > 5) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Command Abuse Detection Triggered!")
            .setDescription(`${message.author}, you are using commands too frequently.`)
          ]
        });
      }

      client.commandCache = commandCache;
    }

    // Channel Lockdown
    if (settings.channellockdown && client.settings.get(message.guild.id, `lockdownChannels.${message.channel.id}`)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Channel Lockdown Triggered!")
          .setDescription(`${message.author}, this channel is currently in lockdown.`)
        ]
      });
    }

    // Anti-Gambling Links
    if (settings.antigambling && /gambling-link-pattern/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Gambling Links Triggered!")
          .setDescription(`${message.author}, gambling links are not allowed.`)
        ]
      });
    }

    // Advertisement Blacklist
    if (settings.adblacklist) {
      const adBlacklist = client.settings.get(message.guild.id, "adBlacklist") || [];
      if (adBlacklist.some(ad => message.content.toLowerCase().includes(ad))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Advertisement Blacklist Triggered!")
            .setDescription(`${message.author}, advertisements are not allowed.`)
          ]
        });
      }
    }

    // Muted Role Assignment
    if (settings.mutedrole && message.member.roles.cache.has(client.settings.get(message.guild.id, "mutedRole"))) {
      await message.delete().catch(() => {});
    }

    // Poll/Survey Moderation
    if (settings.pollmoderation && message.content.includes("poll:")) {
      const pollChannelId = client.settings.get(message.guild.id, "pollChannel");
      if (message.channel.id !== pollChannelId) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Poll Moderation Triggered!")
            .setDescription(`${message.author}, polls are only allowed in the designated channel.`)
          ]
        });
      }
    }

    // Multi-Language Detection & Filter
    if (settings.multilanguagefilter) {
      const restrictedLanguages = client.settings.get(message.guild.id, "restrictedLanguages") || [];
      const detectedLanguage = await client.languageDetector.detect(message.content); // Assume `languageDetector` exists
      if (restrictedLanguages.includes(detectedLanguage)) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Multi-Language Filter Triggered!")
            .setDescription(`${message.author}, messages in this language are not allowed.`)
          ]
        });
      }
    }

    // Temporary Message Freezing
    if (settings.messagefreezing && client.settings.get(message.guild.id, "freezeChannel") === message.channel.id) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Message Freezing Triggered!")
          .setDescription(`${message.author}, this channel is currently frozen.`)
        ]
      });
    }

    // Doxxing Prevention
    if (settings.doxxingprevention && /\b\d{3}-\d{2}-\d{4}\b/.test(message.content)) { // Example: SSN pattern
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Doxxing Prevention Triggered!")
          .setDescription(`${message.author}, sharing sensitive information is not allowed.`)
        ]
      });
    }

    // Warning System
    if (settings.warningsystem) {
      const warns = client.settings.get(message.guild.id, `warns.${message.author.id}`) || 0;
      client.settings.set(message.guild.id, warns + 1, `warns.${message.author.id}`);
      if (warns + 1 >= 3) {
        await message.member.kick("Reached warning limit").catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("Warning System Triggered!")
            .setDescription(`${message.author}, you have been kicked for reaching the warning limit.`)
          ]
        });
      }
    }

    // Auto Role Removal
    if (settings.autoroleremoval) {
      const restrictedRoles = client.settings.get(message.guild.id, "restrictedRoles") || [];
      restrictedRoles.forEach(async (roleId) => {
        if (message.member.roles.cache.has(roleId)) {
          await message.member.roles.remove(roleId).catch(() => {});
        }
      });
    }

    // Channel Age Restrictions
    if (settings.channelagerestrictions) {
      const ageRestrictedChannels = client.settings.get(message.guild.id, "ageRestrictedChannels") || {};
      const userAge = client.settings.get(message.guild.id, `userAge.${message.author.id}`) || 0;
      if (ageRestrictedChannels[message.channel.id] && userAge < ageRestrictedChannels[message.channel.id]) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Channel Age Restriction Triggered!")
            .setDescription(`${message.author}, you do not meet the age requirement for this channel.`)
          ]
        });
      }
    }

    // Link Shortener Blocking
    if (settings.linkshortenerblocking && /(bit\.ly|tinyurl\.com|goo\.gl)/gi.test(message.content)) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Link Shortener Blocking Triggered!")
          .setDescription(`${message.author}, link shorteners are not allowed.`)
        ]
      });
    }

    // Automatic Server Log
    if (settings.serverlog) {
      const logChannelId = client.settings.get(message.guild.id, "logChannel");
      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({
          embeds: [new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Server Log")
            .setDescription(`**User:** ${message.author}\n**Action:** Message Sent\n**Content:** ${message.content}`)
          ]
        });
      }
    }

    // Flooded DM Monitoring
    if (settings.dmfloodmonitoring) {
      const dmFloodCache = client.dmFloodCache || new Map();
      const userDms = dmFloodCache.get(message.author.id) || { count: 0, lastMessage: null };
      const now = Date.now();

      if (userDms.lastMessage && now - userDms.lastMessage < 1000) {
        userDms.count += 1;
      } else {
        userDms.count = 1;
      }

      userDms.lastMessage = now;
      dmFloodCache.set(message.author.id, userDms);

      if (userDms.count > 10) {
        await message.author.send("You are sending too many messages too quickly.").catch(() => {});
      }

      client.dmFloodCache = dmFloodCache;
    }

    // Blacklist Phrase Detection
    if (settings.phraseblacklist) {
      const blacklistedPhrases = client.settings.get(message.guild.id, "blacklistedPhrases") || [];
      if (blacklistedPhrases.some(phrase => message.content.toLowerCase().includes(phrase))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Blacklist Phrase Detection Triggered!")
            .setDescription(`${message.author}, your message contains a restricted phrase.`)
          ]
        });
      }
    }

    // File Type Blocking
    if (settings.filetypeblocking && message.attachments.some(attachment => /\.(exe|bat|sh)$/i.test(attachment.name))) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("File Type Blocking Triggered!")
          .setDescription(`${message.author}, files of this type are not allowed.`)
        ]
      });
    }

    // Anti-Reaction Botting
    if (settings.antireactionbotting && message.reactions.cache.size > 20) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Reaction Botting Triggered!")
          .setDescription(`${message.author}, excessive reactions are not allowed.`)
        ]
      });
    }

    // Auto-Prune Inactive Users
    if (settings.autoprune) {
      const inactiveUsers = message.guild.members.cache.filter(member => {
        const lastMessage = member.lastMessage?.createdTimestamp || 0;
        return Date.now() - lastMessage > 30 * 24 * 60 * 60 * 1000; // 30 days
      });

      inactiveUsers.forEach(async (member) => {
        try {
          await member.kick("Inactive for 30 days").catch(() => {});
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Comment Thread Spam Detection
    if (settings.threadspam && message.channel.isThread() && message.content.length > 500) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Thread Spam Detection Triggered!")
          .setDescription(`${message.author}, excessive content in threads is not allowed.`)
        ]
      });
    }

    // Restricted Word Synonyms Detection
    if (settings.synonymsfilter) {
      const restrictedSynonyms = client.settings.get(message.guild.id, "restrictedSynonyms") || [];
      if (restrictedSynonyms.some(synonym => message.content.toLowerCase().includes(synonym))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Restricted Word Synonyms Detection Triggered!")
            .setDescription(`${message.author}, your message contains restricted synonyms.`)
          ]
        });
      }
    }

    // Anti-Spam Attachments
    if (settings.spamattachments && message.attachments.size > 5) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Anti-Spam Attachments Triggered!")
          .setDescription(`${message.author}, excessive attachments are not allowed.`)
        ]
      });
    }

    // Role-Based Channel Access
    if (settings.rolechannelaccess) {
      const restrictedRoles = client.settings.get(message.guild.id, `restrictedRoles.${message.channel.id}`) || [];
      if (restrictedRoles.some(role => message.member.roles.cache.has(role))) {
        await message.delete().catch(() => {});
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Role-Based Channel Access Triggered!")
            .setDescription(`${message.author}, your role does not allow access to this channel.`)
          ]
        });
      }
    }

    // Notification Spam Blocking
    if (settings.notificationspam && message.mentions.everyone) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Notification Spam Blocking Triggered!")
          .setDescription(`${message.author}, mass notifications are not allowed.`)
        ]
      });
    }

    // Pre-Message Approval System
    if (settings.messageapproval && !message.member.roles.cache.has(client.settings.get(message.guild.id, "approvedRole"))) {
      await message.delete().catch(() => {});
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setTitle("Pre-Message Approval Triggered!")
          .setDescription(`${message.author}, your message requires approval before being posted.`)
        ]
      });
    }
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    // Remove button-related logic
    console.error("Button interactions are no longer supported.");
    await interaction.reply({ content: "Button interactions are no longer supported.", ephemeral: true });
  });
};
