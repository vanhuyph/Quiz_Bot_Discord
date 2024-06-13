const { daysRemainingBefore } = require("../../utils/helperFunctions.js");

const targetDate = new Date("2024-09-06");

module.exports = (client) => {
  remainingDays = daysRemainingBefore(targetDate);
  console.log(`${client.user.tag} has logged in!`);
  client.user.setPresence({
    activities: [{ name: `${remainingDays} days left`, type: 3 }],
  });
};
