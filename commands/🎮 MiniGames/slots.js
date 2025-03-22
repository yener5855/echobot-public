module.exports = {
    name: 'slots',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Spin the slot machine!',
    usage: 'slots',
    run: async (client, message) => {
        const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "💎"];
        const spin = () => Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        const result = spin();

        message.reply(`🎰 Slots: **${result.join(" | ")}**`);
        if (new Set(result).size === 1) {
            message.reply("🎉 Jackpot! You win!");
        } else {
            message.reply("❌ Better luck next time!");
        }
    },
};
