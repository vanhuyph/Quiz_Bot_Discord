require('dotenv').config();
const { Client } = require('discord.js');
const intentOptions = require('./configs/intentOptions.js');
const registerEvents = require('./events/registerEvents');

const token = process.env.TOKEN;
const client = new Client({ intents: intentOptions });

registerEvents(client);

client.login(token);

module.exports = client
