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
    try {
        await interaction?.deferReply({ ephemeral: true });
        const { options } = interaction;
        const Text = options.getString("chat_text");

        const startTime = Date.now();
        const llmStart = Date.now();

        try {
            const apiKey = process.env.GROQ_API_KEY || config.groq_api_key;
            const queueStart = Date.now();

            const response = await fetch(`https://api.groq.com/v1/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: Text }],
                    model: "llama-3.2-3b-preview",
                    temperature: 1,
                    max_completion_tokens: 1024,
                    top_p: 1,
                    stream: true
                })
            });

            const queueEnd = Date.now();
            if (!response.body) {
                return interaction?.editReply({ content: ":cry: **Sorry, I couldn't connect to GROQ_API!**", ephemeral: true });
            }

            const stream = Readable.from(response.body);
            let result = "";
            for await (const chunk of stream) {
                result += chunk.toString();
            }

            const apiEnd = Date.now();
            const metrics = `${(llmStart - startTime).toFixed(3)}ms LLM - ${(queueEnd - queueStart).toFixed(3)}ms QUEUE - ${(apiEnd - queueEnd).toFixed(3)}ms API`;

            await interaction?.editReply({
                content: `**Response:**\n${result}\n\n**Metrics:** ${metrics}\n**Model:** llama-3.2-3b-preview`,
                ephemeral: true
            });
        } catch (e) {
            interaction?.editReply({ content: ":cry: **Sorry, I couldn't connect to GROQ_API!**", ephemeral: true });
            console.error("CHATBOT:", e);
        }
    } catch (e) {
        console.log(String(e.stack).bgRed);
    }
  }
}
