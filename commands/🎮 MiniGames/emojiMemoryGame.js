module.exports = {
    name: 'emojiMemoryGame',
    category: '🎮 MiniGames',
    description: 'Test your memory by recalling a sequence of emojis.',
    usage: 'emojiMemoryGame',
    run: async (client, message) => {
        const emojis = ["😀", "😂", "🥳", "😎", "🤔", "😱", "🤖", "👻"];
        const sequence = Array.from({ length: 5 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
        message.reply(`🧠 Memorize this sequence: ${sequence.join(" ")}`);

        setTimeout(() => {
            message.reply("⏳ Time's up! What was the sequence?");
            const filter = msg => msg.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', msg => {
                if (msg.content === sequence.join(" ")) {
                    collector.stop("correct");
                } else {
                    msg.reply("Incorrect! Try again.");
                }
            });

            collector.on('end', (_, reason) => {
                if (reason === "correct") {
                    message.reply("🎉 Correct! Well done!");
                } else {
                    message.reply(`❌ Time's up! The correct sequence was: ${sequence.join(" ")}`);
                }
            });
        }, 5000);
    },
};
