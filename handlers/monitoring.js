const os = require('os');
const { exec } = require('child_process');

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const CPU_THRESHOLD = 80; // in percentage
const RAM_THRESHOLD = 80; // in percentage
const DISK_THRESHOLD = 80; // in percentage

const checkUsage = () => {
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const ramUsage = (usedMemory / totalMemory) * 100;

    exec('df -h /', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error checking disk usage: ${error.message}`);
            return;
        }
        const diskUsage = parseFloat(stdout.split('\n')[1].split(/\s+/)[4].replace('%', ''));

        if (cpuUsage > CPU_THRESHOLD || ramUsage > RAM_THRESHOLD || diskUsage > DISK_THRESHOLD) {
            sendWebhookNotification(cpuUsage, ramUsage, diskUsage);
            restartBot();
        }
    });
};

const sendWebhookNotification = (cpuUsage, ramUsage, diskUsage) => {
    const payload = {
        content: `Warning: High resource usage detected!\nCPU Usage: ${cpuUsage.toFixed(2)}%\nRAM Usage: ${ramUsage.toFixed(2)}%\nDisk Usage: ${diskUsage.toFixed(2)}%`
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            console.error(`Failed to send webhook notification: ${response.statusText}`);
        }
    }).catch(error => {
        console.error(`Error sending webhook notification: ${error.message}`);
    });
};

const restartBot = () => {
    console.log('Restarting bot due to high resource usage...');
    process.exit(1);
};

module.exports = { checkUsage };
