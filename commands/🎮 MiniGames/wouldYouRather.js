const questions = [
    "Would you rather have the ability to fly or be invisible?",
    "Would you rather live in the past or the future?",
    "Would you rather have unlimited money or unlimited time?",
];
module.exports = {
    name: 'wouldYouRather',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Answer a "Would You Rather" question!',
    usage: 'wouldYouRather',
    run: async (client, message) => {
        const question = questions[Math.floor(Math.random() * questions.length)];
        message.reply(`🤔 ${question}`);
    },
};
