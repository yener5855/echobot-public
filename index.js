/**********************************************************
 * @INFO j [TABLE OF CONTENTS]
 * 1  Import_Modules
   * 1.1 Validating script for advertisement
 * 2  CREATE_THE_DISCORD_BOT_CLIENT
 * 3  Load_Discord_Buttons_and_Discord_Menus
 * 4  Create_the_client.memer
 * 5  create_the_languages_objects
 * 6  Raise_the_Max_Listeners
 * 7  Define_the_Client_Advertisments
 * 8  LOAD_the_BOT_Functions
 * 9  Login_to_the_Bot
 * 
 *   BOT CODED BY: yener5855 | https://yener5855.is-local.org/
 *********************************************************/

debugger;

/**********************************************************
 * @param {1} Import_Modules for this FIle
 *********************************************************/
debugger;
const Discord = require("discord.js");
const colors = require("colors");
const fs = require("fs");
const OS = require('os');
const Events = require("events");
const emojis = require("./botconfig/emojis.json")
const config = require("./botconfig/config.json")
const advertisement = require("./botconfig/advertisement.json")
const { delay } = require("./handlers/functions")
require('dotenv').config()
const { Client, Permissions, Intents } = require("discord.js");
const { checkUsage } = require('./handlers/monitoring');
const lavalinkChecker = require("./handlers/lavalinkChecker"); // removed line
// Add this line to require the setup handler
const setupHandler = require('./handlers/setup');
const UnifiedCollector = require('./utils/collector');
const ErrorHandler = require('./utils/errorHandler');
const FileReader = require('./utils/fileReader');
const CodeEnvironment = require('./utils/codeEnvironment');
const Filters = require('./utils/filters');
const dirSetup = require('./config/dirSetup');
const autoPush = require('./handlers/autoPush');

(async () => {
  const { default: Enmap } = await import("enmap");
  const enmap = new Enmap();
  // ...existing code...
})();

/**********************************************************
 * @param {2} CREATE_THE_DISCORD_BOT_CLIENT with some default settings
 *********************************************************/
debugger;
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MEMBERS,
  Discord.Intents.FLAGS.GUILD_BANS,
  Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
  Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  Discord.Intents.FLAGS.GUILD_INVITES,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_PRESENCES,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activities: [{ name: `${config.status.text}`.replace("{prefix}", config.prefix), type: config.status.type, url: config.status.url }],
    status: "online"
  }
});


module.exports = { client };

/**********************************************************
 * @param {4} Create_the_client.memer property from yener5855's Api 
 *********************************************************/
debugger;
const Meme = require("memer-api");
if (config.memer_api || process.env.memer_api) {
  client.memer = new Meme(process.env.memer_api || config.memer_api); // GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP
}




/**********************************************************
 * @param {5} create_the_languages_objects to select via CODE
 *********************************************************/
debugger;
client.la = {}
var langs = fs.readdirSync("./languages")
for (const lang of langs.filter(file => file.endsWith(".json"))) {
  client.la[`${lang.split(".json").join("")}`] = require(`./languages/${lang}`)
}
Object.freeze(client.la)
//function "handlemsg(txt, options? = {})" is in /handlers/functions 




/**********************************************************
 * @param {6} Raise_the_Max_Listeners to 0 (default 10)
 *********************************************************/
debugger;
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;


/**********************************************************
 * @param {7} Define_the_Client_Advertisments from the Config File
 *********************************************************/
debugger;
client.ad = {
  enabled: advertisement.adenabled,
  statusad: advertisement.statusad,
  spacedot: advertisement.spacedot,
  textad: advertisement.textad
}



/**********************************************************
 * @param {8} LOAD_the_BOT_Functions 
 *********************************************************/
debugger;
//those are must haves, they load the dbs, events and commands and important other stuff
function requirehandlers() {
  ["extraevents", "clientvariables", "command", "loaddb", "events", "erelahandler", "slashCommands"].forEach(handler => {
    try { require(`./handlers/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  ["twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"].forEach(handler => {
    try { require(`./social_log/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  ["logger", "anti_nuke", "antidiscord", "antilinks", "anticaps", "antispam", "blacklist", "keyword", "antimention", "autobackup",

    "apply", "ticket", "ticketevent",
    "roster", "joinvc", "epicgamesverification", "boostlog",

    "welcome", "leave", "ghost_ping_detector", "antiselfbot",

    "jointocreate", "reactionrole", "ranking", "timedmessages",

    "membercount", "autoembed", "suggest", "validcode", "dailyfact", "autonsfw",
    "aichat", "mute", "automeme", "counter"].forEach(handler => {
      try { require(`./handlers/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
    });
  try { require('./handlers/security')(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
} requirehandlers();

// Load handlers
require('./handlers/autodelete')(client);
require('./handlers/logHandler')(client); // Add this line
require('./handlers/jointocreate')(client); // Add this line

const pullHandler = require('./handlers/pullHandler');

client.on('messageCreate', message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check for command prefix
    const prefix = 'pull';
    if (message.content.startsWith(prefix)) {
        pullHandler.handlePull(message);
    }
});

// Laad de VPS status commando
const vpsStatusCommand = require('./commands/👑 Owner/vpsstatus.js');
client.on('messageCreate', (message) => {
    if (message.content.startsWith('!vpsstatus')) {
        vpsStatusCommand.execute(message);
    }
});

const modmailHandler = require('./handlers/modmail');
modmailHandler(client);

// Add setup command
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!setup')) {
        await setupHandler.execute(message);
    }
});

// Ensure subcommand folders are included
dirSetup.subcommandFolders.push('Programming', 'Settings', 'administration');

// Set an interval to check resource usage every 5 minutes
setInterval(checkUsage, 5 * 60 * 1000);

/**********************************************************
 * @param {9} Login_to_the_Bot
 *********************************************************/
debugger;
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Send a message to the main channel with your Discord server link and name
  const mainChannelId = '1326694427405717525'; // Replace with your main channel ID
  const mainChannel = client.channels.cache.get(mainChannelId);
  if (mainChannel) {
    mainChannel.send('Hello! I am online now. Join our Discord server: https://discord.gg/nxJNFAyKwT. Contact @yener5855 for more information.');
  }
  lavalinkChecker(client);
});

// Ensure the bot uses the correct token
client.login(process.env.TOKEN || config.token);

// Example usage
const collector = new UnifiedCollector();
const errorHandler = new ErrorHandler();
const fileReader = new FileReader();
const codeEnvironment = new CodeEnvironment();
const filters = new Filters();

// Collecting data
collector.collect('item1');
collector.collect('item2');
console.log(collector.getData()); // ['item1', 'item2']

// Handling errors
try {
    errorHandler.throwError('An error occurred');
} catch (error) {
    errorHandler.handleError(error);
}

// Reading and writing files
const data = fileReader.readFile('example.txt');
fileReader.writeFile('example_copy.txt', data);

// Managing environment variables
codeEnvironment.setVariable('API_KEY', '12345');
console.log(codeEnvironment.getVariable('API_KEY')); // '12345'

// Filtering data
const dataArray = [1, 2, 2, 3, 4];
const uniqueData = filters.removeDuplicates(dataArray);
console.log(uniqueData); // [1, 2, 3, 4]

autoPush(client); // Initialize the auto-push handler

/**********************************************************
 * @INFO
 * Bot Coded by yener5855 | https://discord.gg/nxJNFAyKwT
 * @INFO
 * Work for yener5855 Development | https://yener5855.is-local.org/
 * @INFO
 * Please mention him / yener5855 Development, when using this Code!
 * @INFO
 *********************************************************/
