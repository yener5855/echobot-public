const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { MessageEmbed, MessageAttachment, Permissions } = require(`discord.js`);
const { Readable } = require("stream");
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

module.exports = client => {
    client.on("messageCreate", async message => {
        try {
            if (!message.guild || !message.channel || message.author.bot) return;

            client.settings.ensure(message.guild.id, { aichat: "no" });
            let chatbot = client.settings.get(message.guild.id, "aichat");
            if (!chatbot || chatbot === "no") return;

            if (message.channel.id === chatbot) {
                if (message.attachments.size > 0) {
                    const attachment = new MessageAttachment("https://cdn.discordapp.com/attachments/816645188461264896/826736269509525524/I_CANNOT_READ_FILES.png");
                    return message.channel.send({ files: [attachment] });
                }

                try {
                    const apiKey = process.env.GROQ_API_KEY || config.groq_api_key;
                    const startTime = Date.now(); // Start timing the response
                    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            messages: [{ role: "user", content: message.content }],
                            model: "llama-3.2-3b-preview",
                            temperature: 1,
                            max_completion_tokens: 1024,
                            top_p: 1,
                            stream: true
                        })
                    });

                    if (!response.body) {
                        console.error("GROQ_API returned no response body.");
                        return message.channel.send({ content: "No response from GROQ_API." });
                    }

                    const stream = response.body; // Use response.body as a Node.js readable stream
                    let result = "";

                    for await (const chunk of stream) {
                        const lines = chunk.toString().split("\n").filter(line => line.trim() !== "");
                        
                        for (const line of lines) {
                            if (line === "data: [DONE]") {
                                break;
                            }

                            if (line.startsWith("data: ")) {
                                try {
                                    const json = JSON.parse(line.substring(6));
                                    const content = json.choices[0]?.delta?.content || "";
                                    result += content;
                                } catch (e) {
                                    console.error("Error parsing JSON:", e, "Line:", line);
                                }
                            }
                        }
                    }

                    const endTime = Date.now(); // End timing the response
                    const responseTime = endTime - startTime;

                    console.log("Final GROQ_API Response:", result); // Debugging log
                    if (!result.trim()) {
                        return message.channel.send({ content: "No meaningful response received from GROQ_API." }).catch(() => {});
                    }

                    const embed = new MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle("AI Response")
                        .setDescription(result)
                        .setFooter(`Model: llama-3.2-3b-preview | Response Time: ${responseTime}ms`);

                    message.channel.send({ embeds: [embed] }).catch(() => {});
                } catch (e) {
                    console.error("Error contacting GROQ_API:", e);
                    message.channel.send({ content: "<:no:833101993668771842> GROQ_API is down." }).catch(() => {});
                }
            }
        } catch (e) {
            console.error("Error in AI chat handler:", e);
        }
    });

    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot ) return;
            for(const user of [...message.mentions.users.values()]){
                if(client.afkDB.has(message.guild.id + user.id)){
                    await message.reply({content: `<:Crying:867724032316407828> **${user.tag}** went AFK <t:${Math.floor(client.afkDB.get(message.guild.id+user.id, "stamp") / 1000)}:R>!${client.afkDB.get(message.guild.id+user.id, "message") && client.afkDB.get(message.guild.id+user.id, "message").length > 1 ? `\n\n__His Message__\n>>> ${String(client.afkDB.get(message.guild.id+user.id, "message")).substring(0, 1800).split(`@`).join(`\`@\``)}` : "" }`}).then(msg=>{
                        setTimeout(()=>{
                            try{
                                msg.delete().catch(() => {});
                            }catch{  }
                        }, 5000)
                    }).catch(() => {})
                }
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });
    // AFK SYSTEM
    client.on("messageCreate", async message => {
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            if(message.content && !message.content.toLowerCase().startsWith("[afk]") && client.afkDB.has(message.guild.id + message.author.id)){
                if(Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 10000) == Math.floor(Date.now() / 10000)) return console.log("AFK CMD");
                await message.reply({content: `:tada: Welcome back **${message.author.username}!** :tada:\n> You went <t:${Math.floor(client.afkDB.get(message.guild.id+message.author.id, "stamp") / 1000)}:R> Afk`}).then(msg=>{
                    setTimeout(()=>{ msg.delete().catch(() => {}) }, 5000)
                }).catch(() => {})
                client.afkDB.delete(message.guild.id + message.author.id)
            }
        }catch(e){
            console.log(String(e).grey)
        }
    });
    // autodelete
    client.on("messageCreate", async message => {
        if(message.guild){
            client.setups.ensure(message.guild.id, {
                autodelete: [/*{ id: "840330596567089173", delay: 15000 }*/]
            })
            let channels = client.setups.get(message.guild.id, "autodelete")
            if(channels && channels.some(ch => ch.id == message.channel.id) && message.channel.type == "GUILD_TEXT"){
                setTimeout(() => {
                    try { 
                        if(!message.deleted) {
                            if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                                message.delete().catch(() => {
                                    //Try a second time
                                    setTimeout(()=>{message.delete().catch(() => { })}, 1500)
                                })
                            } else {
                                message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                                    setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
                                })
                            }
                        }
                    } catch(e){ console.log(e.stack ? String(e.stack).grey : String(e).grey); }
                }, channels.find(ch => ch.id == message.channel.id).delay || 30000)
            }
        }
    })
    // sniping System
    client.on("messageDelete", async message => {
        if (!message.guild || message.guild.available === false || !message.channel || !message.author) return;
        let snipes = client.snipes.has(message.channel.id) ? client.snipes.get(message.channel.id) : [];
        if(snipes.length > 15) snipes.splice(0, 14);
        snipes.unshift({
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.displayAvatarURL(),
            content: message.content,
            image: message.attachments.first()?.proxyURL || null,
            time: Date.now(),
        });
        client.snipes.set(message.channel.id, snipes)
    })
}