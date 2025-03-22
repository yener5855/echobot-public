module.exports = {
    name: 'guess',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Guess the number between 1 and 100',
    usage: 'guess',
    run: async (client, message) => {
        const number = Math.floor(Math.random() * 100) + 1;
        message.reply('I have picked a number between 1 and 100. Start guessing!');

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', msg => {
            const guess = parseInt(msg.content, 10);
            if (isNaN(guess)) {
                msg.reply('Please enter a valid number.');
            } else if (guess === number) {
                msg.reply(`🎉 Correct! The number was ${number}.`);
                collector.stop();
            } else if (guess < number) {
                msg.reply('Too low! Try again.');
            } else {
                msg.reply('Too high! Try again.');
            }
        });

        collector.on('end', collected => {
            if (!collected.some(msg => parseInt(msg.content, 10) === number)) {
                message.reply(`Time's up! The number was ${number}.`);
            }
        });
    },
};
