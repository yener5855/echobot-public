const { MessageEmbed, MessageAttachment } = require('discord.js');
// const { generateMemoryUsageGraph } = require('../../handlers/vpsStatusHandler');
const config = require(`${process.cwd()}/botconfig/config.json`);

// Define the getVpsStatus function
function getVpsStatus() {
    // ...implementation of getVpsStatus...
    return {
        uptime: 123456,
        totalMemory: 2048,
        freeMemory: 1024,
        usedMemory: 1024
    };
}

module.exports = {
    name: 'vpsstatus',
    category: '👑 Owner',
    aliases: ['vps', 'status'],
    description: 'Displays the VPS status.',
    usage: 'vpsstatus',
    run: async (client, message, args) => {
        debugger; // Add debugger statement
        if (!config.ownerIDS.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setTitle('You are not authorized to use this command!')
                ]
            });
        }

        const status = getVpsStatus();
        // const memoryUsageGraph = await generateMemoryUsageGraph();
        // const attachment = new MessageAttachment(memoryUsageGraph, 'memoryUsageGraph.png');

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('VPS Status')
            .addField('Uptime', `${status.uptime} seconds`, true)
            .addField('Total Memory', `${status.totalMemory} MB`, true)
            .addField('Free Memory', `${status.freeMemory} MB`, true)
            .addField('Used Memory', `${status.usedMemory} MB`, true);
            // .setImage('attachment://memoryUsageGraph.png');

        message.channel.send({ embeds: [embed] });
    }
};
