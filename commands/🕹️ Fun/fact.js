const Discord = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (client, interaction, args) => {

    var url = 'https://uselessfacts.jsph.pl/random.json?language=en'


    fetch(url)
        .then(response => response.json())
        .then(data => {
            fact = data.text;

            client.embed({
                title: `😂・Fact`,
                desc: fact,
                type: 'editreply',
            }, interaction);
        })
        .catch(err => console.error(err));
}

