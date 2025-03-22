module.exports = {
    name: 'higherOrLower',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Guess if the next number is higher or lower.',
    usage: 'higherOrLower',
    run: async (client, message) => {
        let currentNumber = Math.floor(Math.random() * 100) + 1;
        message.reply(`🔢 Current number: **${currentNumber}**. Will the next number be higher or lower? (Type "higher" or "lower")`);

        const filter = msg => msg.author.id === message.author.id && ["higher", "lower"].includes(msg.content.toLowerCase());
        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', msg => {
            const nextNumber = Math.floor(Math.random() * 100) + 1;
            const guess = msg.content.toLowerCase();
            const correct = (guess === "higher" && nextNumber > currentNumber) || (guess === "lower" && nextNumber < currentNumber);

            if (correct) {
                collector.stop("correct");
                message.reply(`🎉 Correct! The next number was **${nextNumber}**.`);
            } else {
                collector.stop("incorrect");
                message.reply(`❌ Incorrect! The next number was **${nextNumber}**.`);
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === "time") {
                message.reply("⏳ Time's up!");
            }
        });
    },
};
