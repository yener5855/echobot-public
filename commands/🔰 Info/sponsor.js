const {MessageEmbed} =require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { swap_pages2	 } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
	name: "sponsor",
	category: "🔰 Info",
	aliases: ["sponsors"],
	description: "Shows the sponsor of this BoT",
	usage: "sponsor",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix) => {
		let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
		
	try{
			let embed1 = new MessageEmbed()
		    .setColor(es.color)
		    .setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable1"]))
		    .setURL("http://yener5855-host.de/?utm_source=bot&utm_medium=cpc&utm_id=yener")
		    .setDescription(`
Third Sponsor of This Bot is:
**yener5855-HOST** THE BEST HOSTER
<:arrow:1269532655586644009> yener5855-HOST.de is sponsoring them with some free / cheaper Hosting Methods,
<:arrow:1269532655586644009> Thanks to them, we are able to host our Website, Bots and GAME SERVERS
<:arrow:1269532655586644009> Our suggestion is, if you want to host Bots / Games / Websites, then go to [yener5855-HOST.de](http://yener5855-host.de/?utm_source=bot&utm_medium=cpc&utm_id=yener)

**What they are offering:**
<:arrow:1269532655586644009> **>>** Minecraft Hosting, CounterStrike: Global Offensive, Garry's Mod, ARK, ARMA 3, ...
<:arrow:1269532655586644009> **>>** Cheap and fast Domains
<:arrow:1269532655586644009> **>>** WEBHOSTING
<:arrow:1269532655586644009> **>>** TEAMSPEAK SERVERS
<:arrow:1269532655586644009> **>>** Linux & Windows Root Servers

[**Discord Server:**](https://discord.yener5855-host.de)
[**Website:**](http://yener5855-host.de/?utm_source=bot&utm_medium=cpc&utm_id=yener)
[**__SPONSOR LINK!__**](vhttps://yener5855.is-local.org//img/paysafecard.png)
`)
		    .setImage("https://cdn.yener5855-host.de/img/logo/yener5855_white.png")
		    .setFooter("yener5855-HOST",  "https://imgur.com/jXyDEyb?.png")
		
		let embed2 = new MessageEmbed()
			.setColor(es.color)
			.setTimestamp()
			.setFooter("https://yener5855.is-local.org/ | Code  'x10' == -5%",  'https://imgur.com/UZo3emk.png')
			.setImage("https://cdn.discordapp.com/attachments/807985610265460766/822982640000172062/asdasdasdasdasd.png")
			.setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable4"]))
			.setURL("https://yener5855.is-local.org/")
			.setDescription(`
<:arrow:1269532655586644009> yener5855 is providing us, like yener5855-HOST with free Discord Bot-Hosting technologies

<:arrow:1269532655586644009> If you use the code: **\`x10\`** their, then you'll get at least 5% off everything!

<:arrow:1269532655586644009> Check out their [Website](https://yener5855.is-local.org/) and their [Discord](https://discord.gg/GgjJZCyYKD) to get your own Bot too!`);
			swap_pages2(client, message, [embed1, embed2])
		} catch (e) {
        console.log(String(e.stack).grey.bgRed)
		return message.reply({embeds: [new MessageEmbed()
		  .setColor(es.wrongcolor)
		  .setFooter(client.getFooter(es))
		  .setTitle(client.la[ls].common.erroroccur)
		  .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
		]});
    }
  }
}
