const Discord = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (client, interaction, args) => {

    fetch(
        `https://some-random-api.com/facts/bird`
    )
        .then((res) => res.json()).catch({})
        .then(async (json) => {
            client.embed({
                title: `💡・Random bird fact`,
                desc: json.fact,
                type: 'editreply',
            }, interaction);
        }).catch({})
}

