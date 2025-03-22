const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../botconfig/config.json");

module.exports = {
  name: "serverrules",
  description: `Lists the server rules. Use the prefix ${prefix}serverrules`,
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTitle("📜 Server Rules")
      .setColor("#FF0000")
      .setDescription("Please follow these rules to ensure a friendly and respectful community:")
      .addFields(
        { name: "📌 Rule 1", value: "No spamming or flooding the chat with messages." },
        { name: "📌 Rule 2", value: "Respect all members and staff." },
        { name: "📌 Rule 3", value: "No hate speech, racism, or discrimination." },
        { name: "📌 Rule 4", value: "No advertising or self-promotion without permission." },
        { name: "📌 Rule 5", value: "Keep discussions in the appropriate channels." },
        { name: "📌 Rule 6", value: "Do not share personal information without consent." },
        { name: "📌 Rule 7", value: "No inappropriate or offensive content." },
        { name: "📌 Rule 8", value: "Follow the Discord Community Guidelines." },
        { name: "📌 Rule 9", value: "Do not impersonate other members or staff." },
        { name: "📌 Rule 10", value: "No excessive use of caps or emojis." },
        { name: "📌 Rule 11", value: "Do not engage in arguments or drama." },
        { name: "📌 Rule 12", value: "Respect the decisions of the staff." },
        { name: "📌 Rule 13", value: "Do not use bots to spam or disrupt the server." },
        { name: "📌 Rule 14", value: "No NSFW content or discussions." },
        { name: "📌 Rule 15", value: "Do not share illegal content." },
        { name: "📌 Rule 16", value: "Do not engage in harassment or bullying." },
        { name: "📌 Rule 17", value: "Report any rule violations to the staff." },
        { name: "📌 Rule 18", value: "Do not create multiple accounts to bypass bans." },
        { name: "📌 Rule 19", value: "Do not share pirated software or media." },
        { name: "📌 Rule 20", value: "Keep your username and profile picture appropriate." },
        { name: "📌 Rule 21", value: "Do not engage in doxxing or sharing personal information." },
        { name: "📌 Rule 22", value: "Do not use the server for illegal activities." },
        { name: "📌 Rule 23", value: "Respect the privacy of other members." },
        { name: "📌 Rule 24", value: "Do not engage in disruptive behavior." },
        { name: "📌 Rule 25", value: "Follow any additional rules set by the server staff." }
      )
      .setFooter("Thank you for making our community a better place!", client.user.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
