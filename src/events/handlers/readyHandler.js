const { daysRemainingBefore } = require("../../utils/helperFunctions.js");

const targetDate = new Date("2024-09-06");

module.exports = (client) => {
  remainingDays = daysRemainingBefore(targetDate);
  console.log(`${client.user.tag} has logged in!`);
  client.user.setPresence({
    activity: null,
    status: "online",
    customStatus: { text: `${remainingDays} days left` },
  });
};
