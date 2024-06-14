const { daysRemainingBefore } = require("../../utils/helperFunctions.js");
const moment = require("moment-timezone");

const targetDate = moment.tz("2024-09-06", "Europe/Brussels");

module.exports = (client) => {
  console.log(`${client.user.tag} has logged in!`);

  const updatePresence = () => {
    const remainingDays = daysRemainingBefore(targetDate);
    client.user.setPresence({
      activities: [{ name: `${remainingDays} days left`, type: 3 }],
    });
  };

  updatePresence();
  setInterval(updatePresence, 24 * 60 * 60 * 1000);
};
