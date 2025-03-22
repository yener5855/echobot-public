const schedule = require('node-schedule');
const Enmap = require('enmap');
const path = require('path');

module.exports = (client) => {
  const dir = path.resolve("./databases/birthday");
  if (!client.birthdayDB) client.birthdayDB = new Enmap({ name: "birthdayDB", dataDir: dir });

  schedule.scheduleJob('0 0 * * *', async () => {
    const today = new Date().toISOString().slice(5, 10); // MM-DD format
    client.birthdayDB.fetchEverything().forEach(async (date, userId) => {
      if (date.slice(5, 10) === today) {
        const user = client.users.cache.get(userId);
        const guild = client.guilds.cache.first(); // Adjust this to target the correct guild
        const member = guild.members.cache.get(userId);
        const birthdayRole = guild.roles.cache.find(role => role.name === 'Birthday');

        if (user && member && birthdayRole) {
          await user.send(`Happy Birthday, ${user.username}! 🎉`);
          await member.roles.add(birthdayRole).catch(console.error);
        }
      }
    });
  });
};
