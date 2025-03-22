module.exports = {
    name: 'mathChallenge',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Solve a random math problem!',
    usage: 'mathChallenge',
    run: async (client, message) => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
        const problem = `${num1} ${operator} ${num2}`;
        const answer = eval(problem);

        message.reply(`🧮 Solve this: **${problem}**`);

        const filter = msg => msg.author.id === message.author.id && !isNaN(msg.content);
        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', msg => {
            if (parseInt(msg.content) === answer) {
                collector.stop("correct");
                message.reply("🎉 Correct!");
            } else {
                msg.reply("❌ Incorrect! Try again.");
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === "time") {
                message.reply(`⏳ Time's up! The correct answer was: **${answer}**.`);
            }
        });
    },
};
