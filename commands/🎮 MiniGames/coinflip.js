const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
    name: 'coinflip',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Flip a coin and guess heads or tails.',
    usage: 'coinflip <heads|tails>',
    run: async (client, message, args) => {
        const guess = args[0]?.toLowerCase();
        if (!["heads", "tails"].includes(guess)) {
            return message.reply("Please guess either 'heads' or 'tails'.");
        }

        const result = Math.random() < 0.5 ? "heads" : "tails";
        const response = result === guess ? "You guessed correctly!" : "You guessed wrong!";
        message.reply(`🪙 The coin landed on **${result}**! ${response}`);
    },
};
