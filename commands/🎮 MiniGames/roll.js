module.exports = {
    name: 'roll',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Roll a dice',
    usage: 'roll',
    run: async (client, message) => {
        const roll = Math.floor(Math.random() * 6) + 1;
        message.reply(`🎲 You rolled a **${roll}**!`);
    },
};
