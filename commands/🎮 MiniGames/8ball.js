module.exports = {
    name: '8ball',
    category: '🎮 MiniGames',
    description: 'Ask the magic 8-ball a question',
    usage: '8ball <question>',
    run: async (client, message, args) => {
        const responses = [
            "It is certain.",
            "Without a doubt.",
            "You may rely on it.",
            "Yes, definitely.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ];
        const question = args.join(' ');
        if (!question) return message.reply('Please provide a question for the 8-ball.');
        const response = responses[Math.floor(Math.random() * responses.length)];
        message.reply(`🎱 **Question:** ${question}\n**Answer:** ${response}`);
    },
};
