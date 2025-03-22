const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const settings = require("../botconfig/settings.json");
const { Readable } = require("stream");
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();
module.exports = {
  name: "chat", //the command name for the Slash Command
  description: "Engage in a conversation with the bot", // updated description
  cooldown: 5,
  options: [
		{"String": { name: "chat_text", description: "Wanna Chat with me?", required: false }}, 
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    try{
    //console.log(interaction, StringOption)
		await interaction?.deferReply({ ephemeral: true })
		//things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, 
		        commandName, deferred, replied, ephemeral, 
				options, id, createdTimestamp 
		} = interaction; 
		const { guild } = member;
		//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
		const Text = options.getString("chat_text"); //same as in StringChoices //RETURNS STRING 
		try {
            const apiKey = process.env.GROQ_API_KEY || config.groq_api_key;
            const response = await fetch(`https://api.groq.com/v1/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: Text }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 1,
                    max_completion_tokens: 1024,
                    top_p: 1,
                    stream: true
                })
            });

            if (!response.body) {
                return interaction?.editReply({ content: ":cry: **Sorry, I couldn't connect to GROQ_API!**", ephemeral: true });
            }

            const stream = Readable.from(response.body);
            let result = "";

            for await (const chunk of stream) {
                result += chunk.toString();
            }

            await interaction?.editReply({ content: result, ephemeral: true });
        } catch (e) {
            interaction?.editReply({ content: ":cry: **Sorry, I couldn't connect to GROQ_API!**", ephemeral: true });
            console.error("CHATBOT:", e);
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
  }
}
