var {
  MessageEmbed, MessageSelectMenu, MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-membercount",
  category: "💪 Setup",
  aliases: ["setupmembercount", "membercount-setup", "membercountsetup", "setup-membercounter", "setupmembercounter"],
  cooldown: 5,
  usage: "setup-membercount  -->  Follow the Steps",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    //ensure the database
    let ensureobject = { }
    for(let i = 1; i <= 25; i++){
      ensureobject[`channel${i}`] = "no";
      ensureobject[`message${i}`] = "🗣 Members: {member}";
    }
    client.setups.ensure(message.guild.id,ensureobject,"membercount");
    try {

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        
        let menuoptions = [ ]
        for(let i = 1; i <= 25; i++){
          menuoptions.push({
            value: `${i} Member Counter`,
            description: `Manage/Edit the ${i}. Member Counter`,
            emoji: NumberEmojiIds[i]
          })
        }
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Member Counter!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Member Counter Setup', 'https://cdn.discordapp.com/emojis/891040423605321778.png?size=96', 'https://discord.gg/zYNzbGF8RB')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          }
          else menu?.reply({content: `<a:x_:1211608099908100107> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:verify:1211627420759883797> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function second_layer(SetupNumber, menuoptiondata){
        
        var tempmsg = await message.reply ({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable6"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable7"])).setFooter(client.getFooter(es))]
          })
          await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var message = collected.first();
            if(!message) return message.reply( "NO MESSAGE SENT")
            let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content);
            if(channel){
              var settts = client.setups.get(message.guild.id, `membercount`);
              let name = client.setups.get(message.guild.id, channel.id, `membercount.message${SetupNumber}`)
              let curmessage = name || channel.name;
              client.setups.set(message.guild.id, channel.id, `membercount.channel${SetupNumber}`)
              let temptype = SetupNumber;
              message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable8"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\``.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
              
  
              tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable9"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\`

*Send the Name NOW!, mind that the Name must be shorter then 32 Characters!!!*`)
.addField(`**USER KEYWORDS** (USERS __including__ Bots):`, `> \`{user}\` / \`{users}\` will be replaced with the amount of all users, no matter if bot or not

> \`{online}\` will be replaced with the amount of **ONLINE** USERS  
> \`{idle}\` will be replaced with the amount of **IDLE** USERS  
> \`{dnd}\` will be replaced with the amount of **DND** USERS 
> \`{offline}\` will be replaced with the amount of **OFFLINE** USERS 
> \`{allonline}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** USERS  `)
.addField(`**MEMBER KEYWORDS** (Members __without__ Bots):`, `> \`{member}\` / \`{members}\` will be replaced with the amount of all Members (Humans)

> \`{onlinemember}\` will be replaced with the amount of **ONLINE** MEMBERS  
> \`{idlemember}\` will be replaced with the amount of **IDLE** MEMBERS  
> \`{dndmember}\` will be replaced with the amount of **DND** MEMBERS 
> \`{offlinemember}\` will be replaced with the amount of **OFFLINE** MEMBERS 
> \`{allonlinemember}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** MEMBERS (no Bots)  `)
.addField(`**OTHER KEYWORDS:**`, `> \`{bot}\` / \`{bots}\` will be replaced with the amount of all bots
> \`{channel}\` / \`{channels}\` will be replaced with the amount of all Channels
> \`{text}\` / \`{texts}\` will be replaced with the amount of Text Channels
> \`{voice}\` / \`{voices}\` will be replaced with the amount of Voice Channels
> \`{stage}\` / \`{stages}\` will be replaced with the amount of Stage Channels
> \`{thread}\` / \`{threads}\` will be replaced with the amount of Threads
> \`{news}\` will be replaced with the amount of News Channels
> \`{category}\` / \`{parent}\` will be replaced with the amount of Categories / Parents
> \`{openthread}\` / \`{openthreads}\` will be replaced with the amount of open Threads
> \`{archivedthread}\` / \`{archivedthreads}\` will be replaced with the amount of archived Threads

> \`{role}\` / \`{roles}\` will be replaced with the amount of Roles`)
.addField(`**Examples:**`, `> \`🗣 Members: {members}\`
> \`🗣 Roles: {roles}\`
> \`🗣 Channels: {channels}\`
> \`🗣 Bots: {bots} \`
> \`🗣 All Users: {users}\``)
.setFooter(client.getFooter(es))]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) throw "NO MESSAGE SENT";
                  let name = message.content;
                  if(name && name.length <= 32){
                    let guild = message.guild;
                    client.setups.set(message.guild.id, name, `membercount.message${SetupNumber}`)
                    channel.setName(String(name)
            
                    .replace(/{user}/i, guild.memberCount)
                    .replace(/{users}/i,  guild.memberCount)
          
                    .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                    .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
          
                    .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                    .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
          
                    .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                    .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                    .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
          
                    .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                    .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                    .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
          
                    .replace(/{role}/i, guild.roles.cache.size)
                    .replace(/{roles}/i, guild.roles.cache.size)
          
                    .replace(/{channel}/i, guild.channels.cache.size)
                    .replace(/{channels}/i, guild.channels.cache.size)
          
                    .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                    .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
          
                    .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
                    )
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable10"]))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setDescription(`Example: \`${String(name)
            
                        .replace(/{user}/i, guild.memberCount)
                        .replace(/{users}/i,  guild.memberCount)
              
                        .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                        .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
              
                        .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                        .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
              
                        .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                        .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                        .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
              
                        .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                        .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                        .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
              
                        .replace(/{role}/i, guild.roles.cache.size)
                        .replace(/{roles}/i, guild.roles.cache.size)
              
                        .replace(/{channel}/i, guild.channels.cache.size)
                        .replace(/{channels}/i, guild.channels.cache.size)
              
                        .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                        .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
              
                        .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)}\`
                        
**Checking all Channels every 60 Minutes:**
> **Delay between each channel:** \`5.1 Minutes\` (Only if a Change is needed)
> **Optimal Member-Count Channels:** \`6 or less\``.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    message.reply( "No Name added, or the Name is too long!")
                  }
                })
                .catch(e => {
                  console.log(String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
            else{
              message.reply("NO CHANNEL PINGED / NO ID ADDED");
            }
          })
          .catch(e => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable12"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by AMEEN_BABU | https://github?.com/yener58556966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for AMEEN BABU | https://www.youtube.com/@gaming_squawk
 * @INFO
 * Please mention Him / AMEEN BABU, when using this Code!
 * @INFO
 */
function getNumberEmojis() {
  return [
    "0️⃣",
"1️⃣",
"2️⃣",
"3️⃣",
"4️⃣",
"5️⃣",
"6️⃣",
"7️⃣",
"8️⃣",
"9️⃣",
"🔟",
"1️⃣0️⃣",
"1️⃣1️⃣",
"1️⃣2️⃣",
"1️⃣3️⃣",
"1️⃣4️⃣",
"1️⃣5️⃣",
"1️⃣6️⃣",
"1️⃣7️⃣",
"1️⃣8️⃣",
"1️⃣9️⃣",
"2️⃣0️⃣",
"2️⃣1️⃣",
"2️⃣2️⃣",
"2️⃣3️⃣",
"2️⃣4️⃣",
"2️⃣5️⃣"
  ]
}