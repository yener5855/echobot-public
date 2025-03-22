const words = require('../../utils/words');
module.exports = {
    name: 'hangman',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Play a game of hangman.',
    usage: 'hangman',
    run: async (client, message) => {
        const word = words[Math.floor(Math.random() * words.length)];
        let guessed = Array(word.length).fill("_");
        let attempts = 6;
        const guessedLetters = new Set();

        const renderWord = () => guessed.join(" ");
        message.reply(`🎮 Hangman\nWord: ${renderWord()}\nAttempts left: ${attempts}`);

        const filter = msg => msg.author.id === message.author.id && /^[a-z]$/i.test(msg.content);
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const letter = msg.content.toLowerCase();
            if (guessedLetters.has(letter)) {
                return msg.reply("You already guessed that letter!");
            }
            guessedLetters.add(letter);

            if (word.includes(letter)) {
                word.split("").forEach((char, i) => {
                    if (char === letter) guessed[i] = letter;
                });
                if (!guessed.includes("_")) {
                    collector.stop("win");
                }
            } else {
                attempts--;
                if (attempts === 0) {
                    collector.stop("lose");
                }
            }

            msg.reply(`Word: ${renderWord()}\nAttempts left: ${attempts}`);
        });

        collector.on('end', (_, reason) => {
            if (reason === "win") {
                message.reply(`🎉 You guessed the word: **${word}**!`);
            } else if (reason === "lose") {
                message.reply(`💀 You ran out of attempts! The word was: **${word}**.`);
            } else {
                message.reply("⏳ Time's up!");
            }
        });
    },
};
