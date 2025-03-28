const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
require('dotenv').config();

module.exports = function (client) {
    const githubToken = process.env.GITHUB_TOKEN;

    const job = new CronJob('0 * * * *', () => { // Runs every hour
        console.log("Running automatic push to GitHub...");

        // Verify and clean up the Git repository
        exec('git -C /home/echo-bot fsck --full', (fsckError, fsckStdout, fsckStderr) => {
            if (fsckError) {
                console.error(`Git fsck error: ${fsckError}`);
                console.error("Attempting to clean up the repository...");
                exec('git -C /home/echo-bot gc --prune=now', (gcError, gcStdout, gcStderr) => {
                    if (gcError) {
                        console.error(`Git gc error: ${gcError}`);
                        return;
                    }
                    console.log("Repository cleaned up successfully.");
                    proceedWithPush();
                });
            } else {
                console.log("Repository is healthy.");
                proceedWithPush();
            }
        });

        function proceedWithPush() {
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

                    // Push the changes to the first GitHub repository
                    exec(`git -C /home/echo-bot push https://${githubToken}@github.com/yener5855/echo-bot.git`, (pushError, pushStdout, pushStderr) => {
                        if (pushError) {
                            console.error(`Git push error (first repo): ${pushError}`);
                            return;
                        }

                        console.log("Changes pushed to the first GitHub repository successfully.");

                        // Temporarily remove sensitive files before pushing to the second repository
                        exec('git -C /home/echo-bot rm --cached .env botconfig/config.json', (rmError, rmStdout, rmStderr) => {
                            if (rmError) {
                                console.error(`Error removing sensitive files: ${rmError}`);
                                return;
                            }

                            // Pull changes from the second repository to ensure it is up-to-date
                            exec(`git -C /home/echo-bot pull https://${githubToken}@github.com/yener5855/echobot-public.git`, (pullError, pullStdout, pullStderr) => {
                                if (pullError) {
                                    console.error(`Git pull error (second repo): ${pullError}`);
                                    return;
                                }

                                console.log("Pulled changes from the second GitHub repository successfully.");

                                // Push the changes to the second GitHub repository
                                exec(`git -C /home/echo-bot push https://${githubToken}@github.com/yener5855/echobot-public.git`, (pushError2, pushStdout2, pushStderr2) => {
                                    if (pushError2) {
                                        console.error(`Git push error (second repo): ${pushError2}`);
                                        return;
                                    }

                                    console.log("Changes pushed to the second GitHub repository successfully.");

                                    // Restore the sensitive files to the staging area
                                    exec('git -C /home/echo-bot checkout -- .env botconfig/config.json', (restoreError, restoreStdout, restoreStderr) => {
                                        if (restoreError) {
                                            console.error(`Error restoring sensitive files: ${restoreError}`);
                                        } else {
                                            console.log("Sensitive files restored successfully.");
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }, null, true, 'America/Los_Angeles');

    job.start();
};
