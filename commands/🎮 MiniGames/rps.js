module.exports = {
    name: 'rps',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Play Rock-Paper-Scissors against the bot.',
    usage: 'rps <rock|paper|scissors>',
    run: async (client, message, args) => {
        const choices = ["rock", "paper", "scissors"];
        const userChoice = args[0]?.toLowerCase();
        if (!choices.includes(userChoice)) {
            return message.reply("Please choose 'rock', 'paper', or 'scissors'.");
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let result;
        if (userChoice === botChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = "You win!";
        } else {
            result = "You lose!";
        }

        message.reply(`🤖 Bot chose **${botChoice}**. ${result}`);
    },
};
