const { MessageEmbed, MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
  name: "changemymind",
  description: "Generate a 'Change My Mind' meme with custom text",
  usage: "changemymind <text>",
  category: "🕹️ Fun",
  run: async (client, message, args) => {
    const text = args.join(" ");
    if (!text) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Please provide text for the meme!")
            .setFooter("Usage: changemymind <text>"),
        ],
      });
    }

    const loadingMessage = await message.reply({
      embeds: [
        new MessageEmbed()
          .setColor("BLUE")
          .setTitle("🖼️ Generating your meme...")
          .setFooter("Please wait a moment..."),
      ],
    });

    try {
      const meme = await canvacord.Canvas.changemymind(text);
      const attachment = new MessageAttachment(meme, "changemymind.png");

      await loadingMessage.delete();
      return message.reply({
        files: [attachment],
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setTitle("🎉 Here's your meme!")
            .setImage("attachment://changemymind.png"),
        ],
      });
    } catch (error) {
      console.error(error);
      return loadingMessage.edit({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("❌ Failed to generate the meme!")
            .setFooter("Please try again later."),
        ],
      });
    }
  },
};
