const { MessageEmbed } = require("discord.js");
const config = require('../../botconfig/config.json');

module.exports = {
  name: "memberrespect",
  description: `Guidelines on how members should respect each other. Use the prefix ${config.prefix}memberrespect`,
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTitle("🤝 Member Respect Guidelines")
      .setColor("#0000FF")
      .setDescription("Here are some guidelines on how to respect other members:")
      .addFields(
        { name: "📌 Guideline 1", value: "Listen to others and value their opinions." },
        { name: "📌 Guideline 2", value: "Avoid using offensive language or making personal attacks." },
        { name: "📌 Guideline 3", value: "Be supportive and offer help when needed." },
        { name: "📌 Guideline 4", value: "Respect the privacy and boundaries of others." },
        { name: "📌 Guideline 5", value: "Be patient and understanding in discussions." },
        { name: "📌 Guideline 6", value: "Encourage a positive and inclusive environment." },
        { name: "📌 Guideline 7", value: "Do not interrupt or talk over others." },
        { name: "📌 Guideline 8", value: "Acknowledge and appreciate the contributions of others." },
        { name: "📌 Guideline 9", value: "Do not spread rumors or false information." },
        { name: "📌 Guideline 10", value: "Be open to feedback and constructive criticism." },
        { name: "📌 Guideline 11", value: "Do not engage in gossip or backbiting." },
        { name: "📌 Guideline 12", value: "Show empathy and understanding towards others." },
        { name: "📌 Guideline 13", value: "Do not exclude or isolate others." },
        { name: "📌 Guideline 14", value: "Be mindful of cultural and personal differences." },
        { name: "📌 Guideline 15", value: "Do not make assumptions about others." },
        { name: "📌 Guideline 16", value: "Apologize if you have offended or hurt someone." },
        { name: "📌 Guideline 17", value: "Do not engage in passive-aggressive behavior." },
        { name: "📌 Guideline 18", value: "Be honest and transparent in your interactions." },
        { name: "📌 Guideline 19", value: "Do not take credit for the work of others." },
        { name: "📌 Guideline 20", value: "Respect the opinions and beliefs of others." },
        { name: "📌 Guideline 21", value: "Do not engage in discriminatory behavior." },
        { name: "📌 Guideline 22", value: "Be willing to compromise and find common ground." },
        { name: "📌 Guideline 23", value: "Do not engage in cyberbullying or harassment." },
        { name: "📌 Guideline 24", value: "Show appreciation and gratitude towards others." },
        { name: "📌 Guideline 25", value: "Promote a culture of respect and kindness." }
      )
      .setFooter("Thank you for fostering a respectful community!", client.user.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
