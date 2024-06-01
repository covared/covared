// Cron job to hit endpoint every 14 sec to keep backend alive always
const cron = require("cron");

const backendUrl = "http://localhost:8000";
const job = new cron.CronJob("*/14 * * * * *", async function () {
  // This function will be executed every 14 minutes.
  const fetch = (await import('node-fetch')).default;
  console.log("Restarting server");

  try {
    // Perform a fetch GET request to hit any backend api.
    const response = await fetch(backendUrl);

    if (response.ok) {
      console.log("Server restarted");
    } else {
      console.error(
        `failed to restart server with status code: ${response.status}`
      );
    }
  } catch (err) {
    console.error("Error during Restart:", err.message);
  }
});

// Export the cron job.
module.exports = {
  job,
};
