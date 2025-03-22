const words = require('../../utils/words');
module.exports = {
    name: 'wordScramble',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Unscramble the word!',
    usage: 'wordScramble',
    run: async (client, message) => {
        const word = words[Math.floor(Math.random() * words.length)];
        const scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
        message.reply(`🔤 Unscramble this word: **${scrambled}**`);

        const filter = msg => msg.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', msg => {
            if (msg.content.toLowerCase() === word) {
                collector.stop("correct");
                message.reply("🎉 Correct!");
            } else {
                msg.reply("❌ Incorrect! Try again.");
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === "time") {
                message.reply(`⏳ Time's up! The correct word was: **${word}**.`);
            }
        });
    },
};
