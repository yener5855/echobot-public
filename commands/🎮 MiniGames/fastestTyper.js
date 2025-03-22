module.exports = {
    name: 'fastestTyper',
    category: '🎮 MiniGames',
    description: 'Type the given sentence as fast as possible!',
    usage: 'fastestTyper',
    run: async (client, message) => {
        const sentence = "The quick brown fox jumps over the lazy dog.";
        message.reply(`⌨️ Type this as fast as you can: "${sentence}"`);

        const startTime = Date.now();
        const filter = msg => msg.author.id === message.author.id && msg.content === sentence;
        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', () => {
            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            collector.stop("correct");
            message.reply(`🎉 Correct! You took **${timeTaken} seconds**.`);
        });

        collector.on('end', (_, reason) => {
            if (reason !== "correct") {
                message.reply("⏳ Time's up! You didn't type the sentence correctly.");
            }
        });
    },
};
