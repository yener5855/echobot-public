const questions = [
    { question: "What is the capital of France?", answer: "paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "Who wrote 'To Kill a Mockingbird'?", answer: "harper lee" },
];
module.exports = {
    name: 'trivia',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Answer a trivia question.',
    usage: 'trivia',
    run: async (client, message) => {
        const { question, answer } = questions[Math.floor(Math.random() * questions.length)];
        message.reply(`❓ Trivia Question: ${question}`);

        const filter = msg => msg.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', msg => {
            if (msg.content.toLowerCase() === answer) {
                collector.stop("correct");
            } else {
                msg.reply("Wrong answer! Try again.");
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === "correct") {
                message.reply("🎉 Correct! Well done!");
            } else {
                message.reply(`⏳ Time's up! The correct answer was: **${answer}**.`);
            }
        });
    },
};
