const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require(`${process.cwd()}/botconfig/config.json`);

const webhookClient = new WebhookClient({ url: config.logWebhookURL });

function logToDiscord(level, message) {
  if (!message || message.trim() === '') return; // Ensure message is not empty
  const embed = new MessageEmbed()
    .setColor(level === 'ERROR' ? 'RED' : 'GREEN')
    .setTitle(level)
    .setDescription(message)
    .setTimestamp()
    .setFooter('Console Logger', 'https://i.imgur.com/AfFp7pu.png');

  webhookClient.send({
    embeds: [embed],
  });
}

module.exports = (client) => {
  const originalLog = console.log;
  console.log = function (...args) {
    const message = args.join(' ');
    originalLog.apply(console, args);
    logToDiscord('INFO', message);
  };

  const originalError = console.error;
  console.error = function (...args) {
    const message = args.join(' ');
    originalError.apply(console, args);
    logToDiscord('ERROR', message);
  };
};
