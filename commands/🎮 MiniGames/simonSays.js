module.exports = {
    name: 'simonSays',
    category: '🎮 MiniGames',
    description: 'Follow the commands only if Simon says!',
    usage: 'simonSays',
    run: async (client, message) => {
        const commands = ["jump", "wave", "clap", "dance"];
        const simonSays = Math.random() < 0.5;
        const command = commands[Math.floor(Math.random() * commands.length)];
        const prompt = simonSays ? `Simon says: ${command}` : `Do this: ${command}`;
        message.reply(prompt);

        const filter = msg => msg.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 10000 });

        collector.on('collect', msg => {
            if ((simonSays && msg.content.toLowerCase() === command) || (!simonSays && msg.content.toLowerCase() !== command)) {
                collector.stop("correct");
                message.reply("🎉 Correct!");
            } else {
                collector.stop("incorrect");
                message.reply("❌ Incorrect!");
            }
        });

        collector.on('end', (_, reason) => {
            if (reason === "time") {
                message.reply("⏳ Time's up!");
            }
        });
    },
};
