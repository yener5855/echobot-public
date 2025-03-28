const { MessageEmbed } = require('discord.js');

class AIHandler {
    constructor(client) {
        this.client = client;
        this.apiKey = process.env.GROQ_API_KEY || require(`${process.cwd()}/botconfig/config.json`).groq_api_key;
        if (!this.apiKey) {
            console.error("GROQ_API_KEY is missing. Please set it in the environment variables or config file.");
        }
    }

    handleCommand(command, message) {
        if (command === 'askAI') {
            const input = message.content.replace(/^!askAI\s*/, ""); // Remove command prefix
            const startTime = Date.now();
            this.generateResponse(input).then(response => {
                message.channel.send(response);
            }).catch(error => {
                console.error("Error handling command:", error);
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setTitle("Error")
                        .setDescription("An error occurred while processing your request. Please try again later.")
                        .addField("Response Time", `Generated the Content\nTook: ${Date.now() - startTime}ms`)
                        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    ]
                });
            });
        }
    }

    async generateResponse(input, options = {}) {
        const {
            model = "llama-3.2-3b-preview",
            temperature = 1,
            maxCompletionTokens = 1024,
            topP = 1,
            frequencyPenalty = 0,
            presencePenalty = 0,
            stream = false
        } = options;

        try {
            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, { // Verified correct URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: input }],
                    temperature,
                    max_completion_tokens: maxCompletionTokens,
                    top_p: topP,
                    frequency_penalty: frequencyPenalty,
                    presence_penalty: presencePenalty,
                    stream
                })
            });

            if (!response.ok) {
                console.error(`GROQ_API returned an error: ${response.status} ${response.statusText}`);
                const startTime = Date.now();
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setTitle("API Error")
                        .setDescription(`The API returned an error: ${response.statusText}`)
                        .addField("Response Time", `Generated the Content\nTook: ${Date.now() - startTime}ms`)
                        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    ]
                });
                return `Error: ${response.statusText}`;
            }

            if (!response.body) {
                console.error("GROQ_API returned no response body.");
                return "No response from GROQ_API.";
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }

            console.log("GROQ_API Response:", result); // Debugging log
            return result;
        } catch (error) {
            console.error("Error generating response from GROQ_API:", error);
            return "An error occurred while contacting GROQ_API.";
        }
    }

    logInteraction(interaction) {
        console.log(`Interaction logged: ${interaction}`);
    }
}

module.exports = AIHandler;
