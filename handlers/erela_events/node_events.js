const stringlength = 69;

module.exports = (client) => {
    client.manager
        .on("nodeConnect", (node) => {
            logNodeEvent("connected", node);
        })
        .on("nodeCreate", (node) => {
            logNodeEvent("created", node);
        })
        .on("nodeReconnect", (node) => {
            logNodeEvent("reconnecting", node);
        })
        .on("nodeDisconnect", (node) => {
            logNodeEvent("disconnected", node);
        })
        .on("nodeError", (node, error) => {
            logNodeError(node, error);
        });
};

function logNodeEvent(event, node) {
    const colors = {
        connected: "brightGreen",
        created: "brightGreen",
        reconnecting: "brightYellow",
        disconnected: "brightMagenta"
    };
    const color = colors[event] || "brightRed";
    logMessage(`Node ${event}:`, `{ ${node.options.identifier} }`, color);
}

function logNodeError(node, error) {
    logMessage(`Node errored:`, `{ ${node.options.identifier} }`, "brightRed");
    if (error && error.toString().includes("ECONNREFUSED")) {
        console.error(`No Permissions to Connect to the Lavalink: ${node.options.host}\nPort: ${node.options.port}\nPassword: ${node.options.password}\n :: Maybe wrong password / Lavalink offline?`);
    } else if (error) {
        console.error(error);
    }
}

function logMessage(title, identifier, color) {
    console.log("\n");
    console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold[color]);
    console.log(`     ┃ `.bold[color] + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold[color]);
    console.log(`     ┃ `.bold[color] + `${title} `.bold[color] + " ".repeat(-1 + stringlength - ` ┃ `.length - `${title} `.length) + "┃".bold[color]);
    console.log(`     ┃ `.bold[color] + `${identifier} `.bold[color] + " ".repeat(-1 + stringlength - ` ┃ `.length - `${identifier} `.length) + "┃".bold[color]);
    console.log(`     ┃ `.bold[color] + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold[color]);
    console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold[color]);
}

/**
 * @INFO
 * Bot Coded byyener#5855 | https://github?.com/yener5855/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for yener5855 Development | https://yener5855.is-local.org
 * @INFO
 * Please mention Him / yener5855 Development, when using this Code!
 * @INFO
 */