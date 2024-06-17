const {
  daysRemainingBefore,
  timeUntilMidnight,
} = require("../../utils/helperFunctions.js");
const moment = require("moment-timezone");

const targetDate = moment.tz("2024-09-06", "Europe/Brussels");

module.exports = (client) => {
  console.log(`${client.user.tag} has logged in!`);

  const updatePresence = () => {
    const remainingDays = daysRemainingBefore(targetDate);
    const now = moment.tz("Europe/Brussels");

    if (now.isSame(targetDate, "day")) {
      client.user.setPresence({
        activities: [{ name: `Bisou je manvol`, type: 3 }],
      });
    } else if (now.isAfter(targetDate, "day")) {
      client.user.setPresence({
        activities: [{ name: `/help`, type: 0 }],
      });
    } else {
      client.user.setPresence({
        activities: [{ name: `${remainingDays} days left`, type: 3 }],
      });
    }
  };

  updatePresence();
  setTimeout(() => {
    updatePresence();
    setInterval(updatePresence, 24 * 60 * 60 * 1000);
  }, timeUntilMidnight());
};
