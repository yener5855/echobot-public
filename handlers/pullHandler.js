const { exec } = require('child_process');

module.exports = {
    handlePull: (message) => {
        // Execute the git pull command
        exec('git -C /home/echo-bot pull', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return message.reply(`Error pulling from GitHub: ${stderr}`);
            }

            // Format the announcement message
            const announcement = `DanBot Hosting\nAPP\n � ${new Date().toLocaleString()}\nAutomatic update from GitHub, pulling files.\n\n${stdout}`;
            message.channel.send(announcement);
        });
    }
};