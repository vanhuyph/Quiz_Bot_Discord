module.exports = (client) => {
    console.log(`${client.user.tag} has logged in!`);
    client.user.setPresence({ activities: [{ name: '/help', type: 0 }] });
}