const cohere = require("cohere-ai");
const config = require("../botconfig/config.json");

cohere.init(process.env.COHERE_API_KEY);

const cohereHandler = {
  async generateResponse(prompt) {
    try {
      const response = await cohere.generate({
        model: config.ai_settings.model,
        prompt: prompt,
        max_tokens: config.ai_settings.max_tokens,
        temperature: config.ai_settings.temperature,
      });
      return response.body.generations[0].text.trim();
    } catch (error) {
      console.error("Error generating response from Cohere:", error);
      throw error;
    }
  },
};

module.exports = cohereHandler;
