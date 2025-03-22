const { Manager } = require("erela.js");

module.exports = (client) => {
    const lavalink = client.lavalink;
    if (!lavalink || !lavalink.nodes) {
        console.error("Lavalink nodes are not defined.");
        return;
    }

    const nodes = client.manager.nodes;
    const ownerId = '809533218205466674'; // Replace with the actual owner ID

    const checkNodes = () => {
        nodes.forEach(node => {
            if (node.connected) {
                console.log(`Node ${node.options.identifier} is connected.`);
            } else {
                console.log(`Node ${node.options.identifier} is not connected.`);
            }
        });
    };

    // Check nodes every 5 minutes
    setInterval(checkNodes, 300000);

    // Initial check
    checkNodes();

    // Command to manually check nodes
    client.on('messageCreate', message => {
        if (message.content === '!checknodes' && message.author.id === ownerId) {
            checkNodes();
            message.channel.send('Lavalink nodes status has been logged to the console.');
        }
    });
};
