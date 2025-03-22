const os = require('os');
const { exec } = require('child_process');

const getVpsStatus = () => {
    debugger; // Add debugger statement
    const uptime = os.uptime();
    const loadAverage = os.loadavg();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    return {
        uptime,
        loadAverage,
        totalMemory,
        freeMemory,
        usedMemory,
        memoryUsage
    };
};

module.exports = { getVpsStatus };

module.exports = (client) => {
    client.on('messageCreate', message => {
        if (message.content === '!vpsstatus') {
            exec('uptime', (error, stdout, stderr) => {
                if (error) {
                    message.channel.send(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    message.channel.send(`Stderr: ${stderr}`);
                    return;
                }
                message.channel.send(`VPS Status: ${stdout}`);
            });
        }
    });
};
