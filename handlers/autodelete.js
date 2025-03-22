module.exports = client => {
  client.on("messageCreate", async message => {
    if (message.guild) {
      let settings = client.settings.get(message.guild.id, "autodelete");
      if (settings && settings.channel && settings.time && message.channel.id === settings.channel) {
        setTimeout(() => {
          if (!message.deleted) {
            if (message.channel.permissionsFor(message.channel.guild.me).has("MANAGE_MESSAGES")) {
              message.delete().catch(() => {});
            } else {
              message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                setTimeout(() => { m.delete().catch(() => {}); }, 3500);
              });
            }
          }
        }, settings.time * 1000);
      }
    }
  });
};
