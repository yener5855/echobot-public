const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../botconfig/config.json");

module.exports = {
  name: "staffrules",
  description: `Lists the rules and guidelines for staff members. Use the prefix ${prefix}staffrules`,
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTitle("🛡️ Staff Rules and Guidelines")
      .setColor("#800080")
      .setDescription("Here are the rules and guidelines that staff members must follow:")
      .addFields(
        { name: "📌 Rule 1", value: "Act professionally and respectfully at all times." },
        { name: "📌 Rule 2", value: "Assist members with their issues and provide clear instructions." },
        { name: "📌 Rule 3", value: "Do not abuse your powers or privileges." },
        { name: "📌 Rule 4", value: "Maintain confidentiality and do not share private information." },
        { name: "📌 Rule 5", value: "Follow the server rules and enforce them fairly." },
        { name: "📌 Rule 6", value: "Report any issues or conflicts to higher staff members." },
        { name: "📌 Rule 7", value: "Stay active and participate in staff meetings and discussions." },
        { name: "📌 Rule 8", value: "Do not engage in arguments with members." },
        { name: "📌 Rule 9", value: "Provide timely responses to member inquiries." },
        { name: "📌 Rule 10", value: "Do not show favoritism or bias." },
        { name: "📌 Rule 11", value: "Keep records of member interactions and issues." },
        { name: "📌 Rule 12", value: "Do not share staff-only information with members." },
        { name: "📌 Rule 13", value: "Be transparent and honest in your actions." },
        { name: "📌 Rule 14", value: "Do not use your position for personal gain." },
        { name: "📌 Rule 15", value: "Respect the decisions of higher staff members." },
        { name: "📌 Rule 16", value: "Provide constructive feedback to members." },
        { name: "📌 Rule 17", value: "Do not engage in inappropriate behavior." },
        { name: "📌 Rule 18", value: "Follow the chain of command in resolving issues." },
        { name: "📌 Rule 19", value: "Do not make unilateral decisions without consulting others." },
        { name: "📌 Rule 20", value: "Keep your personal opinions separate from your staff duties." },
        { name: "📌 Rule 21", value: "Do not engage in power struggles with other staff members." },
        { name: "📌 Rule 22", value: "Be proactive in identifying and resolving issues." },
        { name: "📌 Rule 23", value: "Do not ignore member complaints or concerns." },
        { name: "📌 Rule 24", value: "Maintain a positive and professional attitude." },
        { name: "📌 Rule 25", value: "Continuously improve your skills and knowledge." }
      )
      .setFooter("Thank you for your dedication and hard work!", client.user.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
