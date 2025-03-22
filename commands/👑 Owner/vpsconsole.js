const { exec } = require('child_process');
const { MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
    name: 'vpsconsole',
    category: '👑 Owner',
    aliases: ['vpscmd', 'exec'],
    description: 'Executes shell commands on the VPS.',
    usage: 'vpsconsole <command>',
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

        const command = args.join(' ');
        if (!command) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle('Please provide a command to execute.')
                ]
            });
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Error')
                            .setDescription(`\`\`\`${error.message}\`\`\``)
                    ]
                });
            }
            if (stderr) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('ORANGE')
                            .setTitle('Stderr')
                            .setDescription(`\`\`\`${stderr}\`\`\``)
                    ]
                });
            }
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Output')
                        .setDescription(`\`\`\`${stdout}\`\`\``)
                ]
            });
        });
    }
};
