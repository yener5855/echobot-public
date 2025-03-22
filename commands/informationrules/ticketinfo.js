const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../botconfig/config.json");

module.exports = {
  name: "ticketinfo",
  description: `Provides information and rules for tickets. Use the prefix ${prefix}ticketinfo`,
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTitle("🎫 Ticket Information and Rules")
      .setColor("#00FF00")
      .setDescription("Here are the rules and information for creating and managing tickets:")
      .addFields(
        { name: "📌 Rule 1", value: "Be respectful and provide clear information about your issue." },
        { name: "📌 Rule 2", value: "Do not spam or create multiple tickets for the same issue." },
        { name: "📌 Rule 3", value: "Follow the instructions provided by the support team." },
        { name: "📌 Rule 4", value: "Provide all necessary details to help resolve your issue quickly." },
        { name: "📌 Rule 5", value: "Be patient and wait for a response from the support team." },
        { name: "📌 Rule 6", value: "Do not use offensive language in your ticket." },
        { name: "📌 Rule 7", value: "Keep your ticket focused on one issue at a time." },
        { name: "📌 Rule 8", value: "Do not share personal information in your ticket." },
        { name: "📌 Rule 9", value: "Provide screenshots or logs if applicable." },
        { name: "📌 Rule 10", value: "Do not close the ticket until the issue is resolved." },
        { name: "📌 Rule 11", value: "Be honest and accurate in your descriptions." },
        { name: "📌 Rule 12", value: "Do not create tickets for trivial issues." },
        { name: "📌 Rule 13", value: "Respect the support team's time and efforts." },
        { name: "📌 Rule 14", value: "Do not argue with the support team." },
        { name: "📌 Rule 15", value: "Follow up on your ticket if you have additional information." },
        { name: "📌 Rule 16", value: "Do not create tickets for issues outside the server." },
        { name: "📌 Rule 17", value: "Provide your username and relevant details." },
        { name: "📌 Rule 18", value: "Do not create tickets for banned members." },
        { name: "📌 Rule 19", value: "Do not create tickets for suggestions or feedback." },
        { name: "📌 Rule 20", value: "Do not create tickets for server events." },
        { name: "📌 Rule 21", value: "Do not create tickets for role requests." },
        { name: "📌 Rule 22", value: "Do not create tickets for bot commands." },
        { name: "📌 Rule 23", value: "Do not create tickets for server rules." },
        { name: "📌 Rule 24", value: "Do not create tickets for general inquiries." },
        { name: "📌 Rule 25", value: "Do not create tickets for issues already addressed in FAQs." }
      )
      .setFooter("Thank you for following the rules and helping us assist you better!", client.user.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
