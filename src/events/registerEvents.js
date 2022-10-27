const readyHandler = require ('./handlers/readyHandler')
const interactionCreateHandler = require ('./handlers/interactionCreateHandler')

const registerEvents = (client) => {
    client.on('ready', readyHandler);
    client.on('interactionCreate', interactionCreateHandler);
}

module.exports = registerEvents