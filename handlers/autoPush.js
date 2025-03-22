const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
require('dotenv').config();

module.exports = function (client) {
    const githubToken = process.env.GITHUB_TOKEN;

    const job = new CronJob('0 * * * *', () => { // Runs every hour
        console.log("Running automatic push to GitHub...");

        // Add all changes to the staging area
        exec('git -C /home/echo-bot add .', (addError, addStdout, addStderr) => {
            if (addError) {
                console.error(`Git add error: ${addError}`);
                return;
            }

            // Commit the changes
            exec('git -C /home/echo-bot commit -m "Auto-push: Changes committed automatically"', (commitError, commitStdout, commitStderr) => {
                if (commitError) {
                    if (commitStderr.includes("nothing to commit")) {
                        console.log("No changes to commit.");
                        return;
                    }
                    console.error(`Git commit error: ${commitError}`);
                    return;
                }

                // Push the changes to GitHub
                exec(`git -C /home/echo-bot push https://${githubToken}@github.com/yener5855/echo-bot.git`, (pushError, pushStdout, pushStderr) => {
                    if (pushError) {
                        console.error(`Git push error: ${pushError}`);
                        return;
                    }

                    console.log("Changes pushed to GitHub successfully.");
                });
            });
        });
    }, null, true, 'America/Los_Angeles');

    job.start();
};
