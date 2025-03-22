var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup",
  category: "💪 Setup",
  aliases: [""],
  cooldown: 5,
  usage: "setup  -->  Follow the Steps",
  description: "Shows all setup commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language");
    try {
      first_layer()
        async function first_layer(){
          let menuoptions = [
            {
              value: "setup-admin",
              description: `Setup Roles/Users for all/specific Admin Cmds`,
              emoji: "🔨"
            },
            {
              value: "setup-admincmdlog",
              description: `Setup a Logger for Admin Commands to a Channel`,
              emoji: "📑"
            },
            {
              value: "setup-aichat",
              description: `Setup a fun AI-Chat System to chat with me`,
              emoji: "💬"
            },
            {
              value: "setup-anticaps",
              description: `Setup a Anit-CAPS System to prevent CAPS-only msgs`,
              emoji: "🅰️"
            },
            {
              value: "setup-antidiscord",
              description: `Setup a Anit-DISCORD System to prevent DC-LINKS`,
              emoji: "⚙️"
            },
            {
              value: "setup-antilink",
              description: `Setup a Anit-LINK System to prevent LINKS`,
              emoji: "🔗"
            },
            {
              value: "setup-antinuke",
              description: `Setup a Anit-NUKE System to prevent NUKES`,
              emoji: "⚙️"
            },
            {
              value: "setup-apply",
              description: `Setup up to 25 different Apply Systems`,
              emoji: "📋"
            },
            {
              value: "setup-autodelete",
              description: `Setup auto deletion Channels`,
              emoji: "🗑️"
            },
            {
              value: "setup-autoembed",
              description: `Define Channel(s) to replace messages with EMBEDS`,
              emoji: "📰"
            },
            {
              value: "setup-automeme",
              description: `Define a Channel to post MEMES every Minute`,
              emoji: "⚙️"
            },
            {
              value: "setup-autonsfw",
              description: `Define a Channel to post NSFW every Minute`,
              emoji: "🔞"
            },
            {
              value: "setup-blacklist",
              description: `Manage the Word(s)-Blacklist`,
              emoji: "🔠"
            },
            {
              value: "setup-commands",
              description: `Enable/Disable specific Commands`,
              emoji: "⚙️"
            },
            {
              value: "setup-counter",
              description: `Setup a fun Number-Counter Channel`,
              emoji: "#️⃣"
            },
            {
              value: "setup-customcommand",
              description: `Setup up to 25 different Custom-Commands`,
              emoji: "⌨️"
            },
            {
              value: "setup-dailyfact",
              description: `Setup a Channel to post daily Facts`,
              emoji: "🗓"
            },
            {
              value: "setup-embed",
              description: `Setup the Look of the Embeded Messages`,
              emoji: "📕"
            },
            {
              value: "setup-jtc",
              description: `Setup the Join-To-Create Channel(s)`,
              emoji: "🔈"
            },
            {
              value: "setup-keyword",
              description: `Setup up to 25 different Keyword-Messages`,
              emoji: "📖"
            },
            {
              value: "setup-language",
              description: `Manage the Bot's Language`,
              emoji: "🇬🇧"
            },
            {
              value: "setup-leave",
              description: `Manage the Leave Messages`,
              emoji: "📤"
            },
            {
              value: "setup-logger",
              description: `Setup the Audit-Log`,
              emoji: "🛠"
            },
            {
              value: "setup-membercount",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "📈"
            },
            {
              value: "setup-radio",
              description: `Setup the Radio/Waitingroom System`,
              emoji: "📻"
            },
            {
              value: "setup-rank",
              description: `Setup the Ranking System`,
              emoji: "📊"
            },
            {
              value: "setup-reactionrole",
              description: `Setup Infinite Reaction Roles`,
              emoji: "📌"
            },
            {
              value: "setup-reportlog",
              description: `Setup the Report System & Channel`,
              emoji: "🗃"
            },
            {
              value: "setup-roster",
              description: `Setup the Roster System`,
              emoji: "📜"
            },
            {
              value: "setup-serverstats",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "📈"
            },
            {
              value: "setup-suggestion",
              description: `Setup the Suggestion System`,
              emoji: "💡"
            },
            {
              value: "setup-ticket",
              description: `Setup up to 25 different Ticket-Systems`,
              emoji: "📨"
            },
            {
              value: "setup-tiktok",
              description: `Setup up to 3 different TikTok Logger Channels`,
              emoji: "⚙️"
            },
            {
              value: "setup-twitch",
              description: `Setup up to 5 different Twitch Logger Channels`,
              emoji: "⚙️"
            },
            {
              value: "setup-twitter",
              description: `Setup up to 2 different Twitter Logger Channels`,
              emoji: "⚙️"
            },
            {
              value: "setup-validcode",
              description: `Setup the Valid-Code System`,
              emoji: "⚙️"
            },
            {
              value: "setup-warn",
              description: `Setup the Warn System Settings`,
              emoji: "🚫"
            },
            {
              value: "setup-welcome",
              description: `Setup the Welcome System/Messages`,
              emoji: "📥"
            },
            {
              value: "setup-youtube",
              description: `Setup up to 5 different Youtube Logger Channels`,
              emoji: "🚫"
            },
            {
              value: "setup-birthday",
              description: `Setup the Birthday System`,
              emoji: "🎂"
            },
          ]
          let Selection1 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (1/3) Systems [A-C]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index < Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if(option.emoji) Obj.emoji = option.emoji;
              return Obj;
              }
           }).filter(Boolean))
          let Selection2 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (2/3) Systems [C-R]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= Math.ceil(menuoptions.length/3) && index < 2*Math.ceil(menuoptions.length/3)){
                let Obj = {
                  label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                  value: option.value.substring(0, 50),
                  description: option.description.substring(0, 50),
                }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
              }
           }).filter(Boolean))
          let Selection3 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (3/3) Systems [R-Z]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= 2*Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
              }
           }).filter(Boolean))
          //define the embed
          let MenuEmbed1 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (1/3) [A-C]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.com/invite/Yfb2fnkduE")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable1"]))
          let MenuEmbed2 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (2/3) [C-R]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.com/invite/Yfb2fnkduE")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable2"]))
          let MenuEmbed3 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (3/3) [R-Z]", 
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/gear_2699.png",
            "https://discord.com/invite/Yfb2fnkduE")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable3"]))
          //send the menu msg
          let menumsg1 = await message.reply({embeds: [MenuEmbed1], components: [new MessageActionRow().addComponents(Selection1)]})
          let menumsg2 = await message.reply({embeds: [MenuEmbed2], components: [new MessageActionRow().addComponents(Selection2)]})
          let menumsg3 = await message.reply({embeds: [MenuEmbed3], components: [new MessageActionRow().addComponents(Selection3)]})
          //function to handle the menuselection
          function menuselection(menu) {
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            menu?.deferUpdate();
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          //Event
          client.on('interactionCreate',  (menu) => {
            if (menu?.message.id === menumsg1.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg1.edit({components: [], embeds: menumsg1.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:1269533999014084683> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg2.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg2.edit({components: [], embeds: menumsg2.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:1269533999014084683> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg3.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg3.edit({components: [], embeds: menumsg3.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:no:1269533999014084683> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
          });
        }

        async function handle_the_picks(menuoptionindex, menuoptiondata) {
          if (menuoptiondata.value.toLowerCase() === "setup-jtc") {
            await setupJoinToCreate(client, message, args, cmduser, text, prefix);
          } else {
            require(`./${menuoptiondata.value.toLowerCase()}`).run(client, message, args, cmduser, text, prefix);
          }
        }

        async function selectVoiceChannel(message) {
          const voiceChannels = message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE");
          if (!voiceChannels.size) {
            return message.channel.send({ embeds: [new MessageEmbed()
              .setColor("#ff0000")
              .setTitle("No Voice Channels Found")
              .setDescription("There are no voice channels in this server.")
            ]});
          }
        
          const limitedChannels = voiceChannels.first(10); // Limit to the first 10 channels
          const embed = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Select a Voice Channel")
            .setDescription(
              limitedChannels.map((vc, index) => `${index + 1}. ${vc.name}`).join("\n") +
              "\n\nPlease type the number of the voice channel you want to select."
            )
            .setFooter("You have 60 seconds to respond.");
        
          await message.channel.send({ embeds: [embed] });
        
          const filter = m => m.author.id === message.author.id && !isNaN(m.content) && m.content > 0 && m.content <= limitedChannels.length;
          const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] }).catch(() => null);
        
          if (!collected) {
            return message.channel.send({ embeds: [new MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Time Expired")
              .setDescription("You did not select a voice channel in time.")
            ]});
          }
        
          const selectedChannel = limitedChannels[Number(collected.first().content) - 1];
          return selectedChannel;
        }

        async function setupJoinToCreate(client, message, args, cmduser, text, prefix) {
          try {
            const embedInstruction = new MessageEmbed()
              .setColor("#00ff00")
              .setTitle("Join-To-Create Setup")
              .setDescription(
                "Please choose an option:\n\n" +
                "1️⃣ Select an existing voice channel.\n" +
                "2️⃣ Let the bot create a new voice channel for Join-To-Create."
              )
              .setFooter("React with 1️⃣ or 2️⃣ to proceed.");
        
            const instructionMessage = await message.channel.send({ embeds: [embedInstruction] });
            await instructionMessage.react("1️⃣");
            await instructionMessage.react("2️⃣");
        
            const filter = (reaction, user) => {
              return ["1️⃣", "2️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
            };
        
            const collected = await instructionMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] });
            const reaction = collected.first();
        
            if (reaction.emoji.name === "1️⃣") {
              // Option 1: Select an existing voice channel
              const selectedChannel = await selectVoiceChannel(message);
              if (!selectedChannel) return;
        
              client.settings.set(message.guild.id, selectedChannel.id, "jtcChannel");
        
              const embedSuccess = new MessageEmbed()
                .setColor("#00ff00")
                .setTitle("Join-To-Create Setup Complete")
                .setDescription(`Join-To-Create has been successfully set up for the channel: **${selectedChannel.name}**`)
                .setFooter("Setup successful.");
              await message.channel.send({ embeds: [embedSuccess] });
        
            } else if (reaction.emoji.name === "2️⃣") {
              // Option 2: Let the bot create a new voice channel
              const newChannel = await message.guild.channels.create("Join-To-Create", { type: "GUILD_VOICE" });
              client.settings.set(message.guild.id, newChannel.id, "jtcChannel");
        
              const embedSuccess = new MessageEmbed()
                .setColor("#00ff00")
                .setTitle("Join-To-Create Setup Complete")
                .setDescription(`A new voice channel named **${newChannel.name}** has been created and set up for Join-To-Create.`)
                .setFooter("Setup successful.");
              await message.channel.send({ embeds: [embedSuccess] });
            }
          } catch (error) {
            console.error(error);
            const embedError = new MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Setup Error")
              .setDescription("An error occurred while setting up Join-To-Create. Please try again.")
              .setFooter("Setup failed.");
            message.channel.send({ embeds: [embedError] });
          }
        }
      } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable10"]))
      ]});
    }
  },
};
