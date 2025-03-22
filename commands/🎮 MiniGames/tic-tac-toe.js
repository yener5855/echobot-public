module.exports = {
    name: 'tic-tac-toe',
    category: '🎮 MiniGames', // Ensure this is set
    description: 'Play a game of Tic-Tac-Toe',
    usage: 'tic-tac-toe <@opponent>',
    run: async (client, message, args) => {
        const opponent = message.mentions.users.first();
        if (!opponent) return message.reply('Please mention a user to challenge.');
        if (opponent.bot) return message.reply('You cannot play against a bot!');
        if (opponent.id === message.author.id) return message.reply('You cannot play against yourself!');

        const board = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let currentPlayer = message.author;

        const renderBoard = () => board.slice(0, 3).join(' ') + '\n' + board.slice(3, 6).join(' ') + '\n' + board.slice(6).join(' ');

        message.channel.send(`🎮 Tic-Tac-Toe\n${renderBoard()}\n${currentPlayer}, it's your turn! Choose a number.`);

        const filter = response => response.author.id === currentPlayer.id && /^[1-9]$/.test(response.content) && board[parseInt(response.content) - 1] !== '❌' && board[parseInt(response.content) - 1] !== '⭕';
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const move = parseInt(msg.content) - 1;
            board[move] = currentPlayer.id === message.author.id ? '❌' : '⭕';
            if (checkWin()) {
                collector.stop();
                return message.channel.send(`🎉 ${currentPlayer} wins!\n${renderBoard()}`);
            }
            if (board.every(cell => cell === '❌' || cell === '⭕')) {
                collector.stop();
                return message.channel.send(`It's a draw!\n${renderBoard()}`);
            }
            currentPlayer = currentPlayer.id === message.author.id ? opponent : message.author;
            message.channel.send(`🎮 Tic-Tac-Toe\n${renderBoard()}\n${currentPlayer}, it's your turn! Choose a number.`);
        });

        collector.on('end', collected => {
            if (!collected.size) message.channel.send('Game over! Time ran out.');
        });

        function checkWin() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            return winPatterns.some(pattern => pattern.every(index => board[index] === (currentPlayer.id === message.author.id ? '❌' : '⭕')));
        }
    },
};
